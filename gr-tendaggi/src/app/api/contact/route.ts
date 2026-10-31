import { z } from "zod";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 3000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return json(403, { ok: false, code: "forbidden" });
  }
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return json(415, { ok: false, code: "unsupported" });
  }

  const raw = await request.text();
  if (raw.length > 12_000) return json(413, { ok: false, code: "too_large" });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, code: "invalid" });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json(422, { ok: false, code: "validation", fields: z.flattenError(parsed.error).fieldErrors });
  }
  const data = parsed.data;

  // Bots that fill the hidden field get a neutral answer and nothing is sent.
  if (data.website) return json(200, { ok: true });

  const elapsed = Date.now() - data.startedAt;
  if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    return json(400, { ok: false, code: "timing" });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) return json(429, { ok: false, code: "rate_limited" });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return json(503, { ok: false, code: "not_configured" });
  }

  const text = [
    `Nuova richiesta dal sito`,
    ``,
    `Nome: ${data.name}`,
    `Email: ${data.email}`,
    `Telefono: ${data.phone || "non indicato"}`,
    `Categoria: ${data.interest}`,
    ``,
    `Messaggio:`,
    data.message,
    ``,
    `Consenso privacy: sì (${new Date().toISOString()})`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: oneLine(`Richiesta preventivo · ${data.interest} · ${data.name}`).slice(0, 180),
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("contact: email provider responded", res.status);
      return json(502, { ok: false, code: "send_failed" });
    }
  } catch (err) {
    console.error("contact: email provider unreachable", err instanceof Error ? err.name : "unknown");
    return json(502, { ok: false, code: "send_failed" });
  }

  return json(200, { ok: true });
}

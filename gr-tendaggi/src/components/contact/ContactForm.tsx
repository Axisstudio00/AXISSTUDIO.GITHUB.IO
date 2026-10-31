"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { contactSchema, type ContactField } from "@/lib/contact-schema";
import { company, interestOptions } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "not_configured" | "rate_limited" | "error";
type Errors = Partial<Record<ContactField, string>>;

const fieldOrder: ContactField[] = ["name", "email", "phone", "interest", "message", "privacy"];

const inputBase =
  /* taste-skill-ignore: form field focus underline */ "mt-2 block w-full bg-warm px-4 py-3.5 text-[1rem] text-charcoal outline-none transition-[box-shadow,background-color] duration-200 placeholder:text-muted/80 focus:bg-white focus:shadow-[inset_0_-2px_0_0_var(--color-bronze-ink)] aria-[invalid=true]:shadow-[inset_0_-2px_0_0_var(--color-error)]";

function ErrorText({ f, message }: { f: ContactField; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${f}-error`} className="mt-2 text-[1rem] text-[var(--color-error)]">
      {message}
    </p>
  );
}

function buildMailto(v: { interest: string; message: string; name: string; phone: string }) {
  const subject = encodeURIComponent(`Richiesta preventivo${v.interest ? ` · ${v.interest}` : ""}`);
  const body = encodeURIComponent(`${v.message}\n\n${v.name}\n${v.phone}`.trim());
  return `mailto:${company.email}?subject=${subject}&body=${body}`;
}

export function ContactForm({ defaultInterest }: { defaultInterest?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [startedAt] = useState(() => Date.now());
  const [mailtoHref, setMailtoHref] = useState(`mailto:${company.email}`);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const initialInterest = interestOptions.find((o) => o === defaultInterest) ?? "";

  const read = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    return {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? ""),
      interest: String(fd.get("interest") ?? ""),
      message: String(fd.get("message") ?? ""),
      privacy: fd.get("privacy") === "on",
      website: String(fd.get("website") ?? ""),
      startedAt,
    };
  };

  const focusFirst = (errs: Errors) => {
    const first = fieldOrder.find((f) => errs[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const values = read(e.currentTarget);
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const flat = z.flattenError(parsed.error).fieldErrors as Record<string, string[] | undefined>;
      const next: Errors = {};
      for (const f of fieldOrder) if (flat[f]?.[0]) next[f] = flat[f]![0];
      setErrors(next);
      focusFirst(next);
      return;
    }
    setErrors({});
    setMailtoHref(buildMailto(values));
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        fields?: Record<string, string[]>;
      };
      if (res.ok && body.ok) {
        setStatus("sent");
        formRef.current?.reset();
      } else if (body.code === "validation" && body.fields) {
        const next: Errors = {};
        for (const f of fieldOrder) if (body.fields[f]?.[0]) next[f] = body.fields[f][0];
        setErrors(next);
        setStatus("idle");
        focusFirst(next);
        return;
      } else if (body.code === "not_configured") {
        setStatus("not_configured");
      } else if (body.code === "rate_limited") {
        setStatus("rate_limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const describedBy = (f: ContactField, hint?: string) =>
    [errors[f] ? `${f}-error` : "", hint ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-describedby="form-note"
      className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2"
    >
      <div className="sm:col-span-1">
        <label htmlFor="name" className="text-[1rem] font-medium">
          Nome e cognome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("name")}
          className={inputBase}
        />
        <ErrorText f="name" message={errors.name} />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="email" className="text-[1rem] font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={160}
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
          className={inputBase}
        />
        <ErrorText f="email" message={errors.email} />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="phone" className="text-[1rem] font-medium">
          Telefono <span className="font-normal text-muted">(facoltativo)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={30}
          aria-invalid={!!errors.phone}
          aria-describedby={describedBy("phone")}
          className={inputBase}
        />
        <ErrorText f="phone" message={errors.phone} />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="interest" className="text-[1rem] font-medium">
          Categoria di interesse
        </label>
        <select
          id="interest"
          name="interest"
          required
          defaultValue={initialInterest}
          aria-invalid={!!errors.interest}
          aria-describedby={describedBy("interest")}
          className={`${inputBase} cursor-pointer appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 8%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%23252420%22 stroke-width=%221.4%22/></svg>')] pr-10`}
        >
          <option value="" disabled>
            Scegli una categoria
          </option>
          {interestOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ErrorText f="interest" message={errors.interest} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="text-[1rem] font-medium">
          Messaggio
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={3000}
          placeholder="Ambiente, misure indicative, esposizione, tempi…"
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
          className={`${inputBase} resize-y`}
        />
        <ErrorText f="message" message={errors.message} />
      </div>

      <div
        aria-hidden="true"
        className={/* taste-skill-ignore: invisible honeypot */ "absolute -left-[9999px] h-px w-px overflow-hidden"}
      >
        <label htmlFor="website">Sito web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <div className="flex items-start gap-3">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            required
            aria-invalid={!!errors.privacy}
            aria-describedby={describedBy("privacy")}
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-charcoal"
          />
          <label htmlFor="privacy" className="cursor-pointer text-[1rem] leading-relaxed">
            Ho letto la{" "}
            <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-bronze-ink">
              privacy policy
            </Link>{" "}
            e acconsento al trattamento dei miei dati per ricevere una risposta alla richiesta.
          </label>
        </div>
        <ErrorText f="privacy" message={errors.privacy} />
      </div>

      <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn cursor-pointer disabled:cursor-wait disabled:opacity-70"
        >
          <span>{status === "sending" ? "Invio in corso…" : "Invia la richiesta"}</span>
          <svg aria-hidden="true" viewBox="0 0 20 12" width="20" height="12" className="btn-arrow">
            <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
        <p id="form-note" className="text-[0.875rem] text-muted">
          Ti rispondiamo via email o telefono.
        </p>
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none sm:col-span-2">
        {status === "sent" && (
          <p className="bg-sand p-5">Grazie, la tua richiesta è stata inviata. Ti ricontatteremo al più presto.</p>
        )}
        {status === "not_configured" && (
          <div className="bg-sand p-5">
            <p>
              L&apos;invio online non è ancora attivo, quindi la richiesta non è stata inviata. Puoi mandarla subito per
              email o chiamarci:
            </p>
            <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-medium">
              <a href={mailtoHref} className="underline underline-offset-4">
                Scrivi a {company.email}
              </a>
              {company.phones.map((p) => (
                <a key={p.href} href={p.href} className="underline underline-offset-4">
                  {p.label}
                </a>
              ))}
            </p>
          </div>
        )}
        {status === "rate_limited" && (
          <p className="bg-sand p-5">
            Hai inviato diverse richieste in poco tempo. Riprova tra qualche minuto o chiamaci.
          </p>
        )}
        {status === "error" && (
          <p className="bg-sand p-5">
            Qualcosa non ha funzionato e la richiesta non è stata inviata. Riprova, oppure scrivi a{" "}
            <a href={`mailto:${company.email}`} className="underline underline-offset-4">
              {company.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

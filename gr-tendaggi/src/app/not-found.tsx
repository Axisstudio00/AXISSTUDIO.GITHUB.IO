import Link from "next/link";
import { Picture } from "@/components/ui/Picture";

export default function NotFound() {
  return (
    <section
      aria-labelledby="nf-title"
      className="frame bg-warm pt-[calc(var(--header-h)+clamp(3rem,10vh,7rem))] pb-[var(--section-gap)]"
    >
      <div className="grid-12 items-end gap-y-10">
        <div className="col-span-12 md:col-span-6">
          <h1 id="nf-title" className="text-display leading-[0.98]">
            Questa pagina
            <br />è rimasta al buio.
          </h1>
          <p className="mt-6 max-w-[40ch]">
            L&apos;indirizzo non esiste o è stato spostato. Torna alla home o guarda le nostre soluzioni.
          </p>
          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-medium">
            <Link href="/" className="underline underline-offset-[6px] hover:text-bronze-ink">
              Torna alla home
            </Link>
            <Link href="/contatti" className="underline underline-offset-[6px] hover:text-bronze-ink">
              Contatti
            </Link>
          </p>
        </div>
        <div className="col-span-8 col-start-5 md:col-span-4 md:col-start-9">
          <Picture
            id="cameraVelo"
            sizes="(min-width: 768px) 30vw, 66vw"
            imgClassName="aspect-[4/5] w-full object-cover brightness-75"
          />
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { Photo } from '@/components/Photo';

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[100svh] items-center gap-10 pb-20 pt-[calc(var(--header-h)+3rem)] md:grid-cols-12 md:gap-6">
      <div className="md:col-span-5">
        <h1 className="text-[clamp(2.75rem,1.6rem+4vw,5.5rem)]">
          Questa finestra
          <br />
          è chiusa.
        </h1>
        <p className="t-lead mt-6 max-w-[30ch]">La pagina che cerchi non esiste o è stata spostata.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">Torna alla home</Link>
          <Link href="/soluzioni/" className="btn btn-paper">Vedi le soluzioni</Link>
        </div>
      </div>
      <Photo name="tapparelle" alt="Tapparella abbassata su una finestra" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] md:col-span-6 md:col-start-7" />
    </section>
  );
}

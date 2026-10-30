'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { categories, productsByCategory } from '@/content/products';
import { site, whatsappHref } from '@/content/site';
import { FORM_NAME, FORM_VERSION, newLeadId, submitQuote } from '@/lib/quote';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<'nome' | 'cognome' | 'email' | 'telefono' | 'prodotto' | 'localita' | 'messaggio' | 'privacy', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s./-]{6,20}$/;

function validate(f: FormData): Errors {
  const e: Errors = {};
  const v = (k: string) => String(f.get(k) ?? '').trim();
  if (!v('nome')) e.nome = 'Inserisci il nome.';
  if (!v('cognome')) e.cognome = 'Inserisci il cognome.';
  if (!v('email')) e.email = 'Inserisci un indirizzo email.';
  else if (!EMAIL_RE.test(v('email'))) e.email = 'L’indirizzo email non sembra corretto.';
  if (!v('telefono')) e.telefono = 'Inserisci un numero di telefono.';
  else if (!PHONE_RE.test(v('telefono'))) e.telefono = 'Usa solo numeri, spazi e il prefisso +.';
  if (!v('prodotto')) e.prodotto = 'Scegli una soluzione, oppure “Non lo so ancora”.';
  if (!v('localita')) e.localita = 'Indica il comune dell’intervento.';
  if (v('messaggio').length < 10) e.messaggio = 'Scrivi qualche dettaglio in più (almeno 10 caratteri).';
  if (f.get('privacy') !== 'si') e.privacy = 'Serve il consenso per poterti ricontattare.';
  return e;
}

export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [leadId, setLeadId] = useState('');
  const [product, setProduct] = useState('');
  const [page, setPage] = useState('');

  useEffect(() => {
    setLeadId(newLeadId());
    const params = new URLSearchParams(window.location.search);
    const p = params.get('prodotto');
    if (p) setProduct(p);
    setPage(window.location.pathname + window.location.search);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const errs = validate(new FormData(form));
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      await submitQuote(form);
      setStatus('sent');
      form.reset();
      setLeadId(newLeadId());
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="bg-field p-8 text-white md:p-12">
        <p className="font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-none">Richiesta inviata.</p>
        <p className="mt-5 max-w-[42ch]">
          Grazie: ti ricontatteremo al più presto per parlare del tuo progetto. Se preferisci, puoi anche chiamarci al{' '}
          <a href={site.phones[0].href} className="underline underline-offset-4">{site.phones[0].label}</a>.
        </p>
        <button type="button" className="btn btn-paper mt-8" onClick={() => setStatus('idle')}>
          Invia un’altra richiesta
        </button>
      </div>
    );
  }

  const field = (name: keyof Errors) => ({
    name,
    id: `f-${name}`,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `e-${name}` : undefined,
    onChange: () => errors[name] && setErrors((x) => ({ ...x, [name]: undefined })),
  });
  const Err = ({ name }: { name: keyof Errors }) =>
    errors[name] ? (
      <p id={`e-${name}`} className="t-small mt-2 text-[#9b2c1c]">{errors[name]}</p>
    ) : null;
  const input =
    'mt-2 block w-full bg-paper px-4 py-3.5 text-[1rem] text-ink transition-colors placeholder:text-muted/70 focus:bg-white focus:outline-2 focus:outline-offset-0 focus:outline-accent aria-[invalid=true]:bg-[#f7e6e1]';

  return (
    <form
      ref={formRef}
      name={FORM_NAME}
      method="POST"
      action="/contatti/grazie/"
      data-netlify="true"
      netlify-honeypot="azienda_web"
      noValidate
      onSubmit={onSubmit}
      className="grid gap-x-4 gap-y-6 sm:grid-cols-2"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      {/* Campi per il futuro collegamento al gestionale */}
      <input type="hidden" name="lead_id" value={leadId} />
      <input type="hidden" name="origine" value="sito-web" />
      <input type="hidden" name="pagina" value={page} />
      <input type="hidden" name="versione_modulo" value={FORM_VERSION} />
      {/* Honeypot anti-spam: invisibile alle persone */}
      <p className="hidden" aria-hidden>
        <label>
          Non compilare questo campo <input name="azienda_web" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div>
        <label htmlFor="f-nome">Nome</label>
        <input {...field('nome')} type="text" autoComplete="given-name" className={input} required />
        <Err name="nome" />
      </div>
      <div>
        <label htmlFor="f-cognome">Cognome</label>
        <input {...field('cognome')} type="text" autoComplete="family-name" className={input} required />
        <Err name="cognome" />
      </div>
      <div>
        <label htmlFor="f-email">Email</label>
        <input {...field('email')} type="email" autoComplete="email" inputMode="email" className={input} required />
        <Err name="email" />
      </div>
      <div>
        <label htmlFor="f-telefono">Telefono</label>
        <input {...field('telefono')} type="tel" autoComplete="tel" inputMode="tel" className={input} required />
        <Err name="telefono" />
      </div>
      <div>
        <label htmlFor="f-prodotto">Soluzione che ti interessa</label>
        <select
          {...field('prodotto')}
          value={product}
          onChange={(e) => {
            setProduct(e.target.value);
            if (errors.prodotto) setErrors((x) => ({ ...x, prodotto: undefined }));
          }}
          className={`${input} appearance-none`}
          required
        >
          <option value="">Scegli…</option>
          {categories.map((c) => (
            <optgroup key={c.id} label={c.title}>
              {productsByCategory(c.id).map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </optgroup>
          ))}
          <option value="non-so">Non lo so ancora</option>
        </select>
        <Err name="prodotto" />
      </div>
      <div>
        <label htmlFor="f-localita">Località dell’intervento</label>
        <input {...field('localita')} type="text" autoComplete="address-level2" placeholder="Es. Bologna, Imola, Modena" className={input} required />
        <Err name="localita" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="f-messaggio">Messaggio</label>
        <textarea {...field('messaggio')} rows={5} placeholder="Ambiente, misure indicative, esigenze di luce o privacy…" className={`${input} resize-y`} required />
        <Err name="messaggio" />
      </div>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input {...field('privacy')} id="f-privacy" type="checkbox" value="si" className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]" required />
          <span className="text-[1rem]">
            Ho letto l’<Link href="/privacy/" className="underline underline-offset-4" target="_blank">informativa privacy</Link> e acconsento
            al trattamento dei dati per ricevere il preventivo.
          </span>
        </label>
        <Err name="privacy" />
      </div>

      <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Invio in corso…' : 'Invia la richiesta'} <ArrowRight size={18} aria-hidden />
        </button>
        <p className="t-small text-muted">Rispondiamo con un contatto diretto, senza impegno.</p>
      </div>
      {status === 'error' && (
        <div role="alert" className="bg-ink p-5 text-paper sm:col-span-2">
          Non siamo riusciti a inviare la richiesta. Riprova tra poco, oppure chiamaci al{' '}
          <a href={site.phones[0].href} className="underline underline-offset-4">{site.phones[0].label}</a>, scrivici su{' '}
          <a href={whatsappHref()} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">WhatsApp</a> o a{' '}
          <a href={`mailto:${site.email}`} className="underline underline-offset-4">{site.email}</a>.
        </div>
      )}
    </form>
  );
}

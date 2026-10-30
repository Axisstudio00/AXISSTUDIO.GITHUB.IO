import { testimonials } from '@/content/testimonials';

// Mostrata solo se esistono testimonianze reali approvate (content/testimonials.ts).
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section aria-labelledby="voci-title" className="section bg-paper">
      <div className="wrap">
        <h2 id="voci-title" className="t-head">Dicono di noi</h2>
        <div className="mt-16 grid gap-16 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.author}>
              <blockquote className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] leading-[1.2]">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-muted">
                {t.author}
                {t.context ? `, ${t.context}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

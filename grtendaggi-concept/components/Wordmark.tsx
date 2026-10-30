// Logotipo PROVVISORIO in testo: sostituire con il logo vettoriale originale fornito dal cliente.
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 leading-none ${className}`}>
      <span className="font-display text-[1.6rem] tracking-[-0.02em]">GRtendaggi</span>
      <span className="text-[1rem] tracking-[0.04em]">Concept</span>
    </span>
  );
}

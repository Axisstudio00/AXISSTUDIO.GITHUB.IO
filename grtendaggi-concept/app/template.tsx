// Transizione tra pagine: il template si rimonta a ogni navigazione e riparte l'animazione CSS.
// Funziona anche senza JavaScript e rispetta prefers-reduced-motion.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}

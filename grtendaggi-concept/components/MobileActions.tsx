import Link from 'next/link';
import { Phone, MessageCircle, FileText } from 'lucide-react';
import { site, whatsappHref } from '@/content/site';

// Barra contatti fissa solo su smartphone: chiamata, WhatsApp, preventivo a portata di pollice.
export function MobileActions() {
  return (
    <nav
      aria-label="Contatti rapidi"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 bg-ink text-paper md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a href={site.phones[0].href} className="flex min-h-14 items-center justify-center gap-2 text-[1rem]">
        <Phone size={18} aria-hidden /> Chiama
      </a>
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 items-center justify-center gap-2 bg-[#3a2a22] text-[1rem]"
      >
        <MessageCircle size={18} aria-hidden /> WhatsApp
      </a>
      <Link href="/contatti/#preventivo" className="flex min-h-14 items-center justify-center gap-2 bg-accent text-[1rem]">
        <FileText size={18} aria-hidden /> Preventivo
      </Link>
    </nav>
  );
}

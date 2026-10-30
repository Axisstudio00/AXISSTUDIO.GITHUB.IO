import { HeroWindow } from '@/components/home/HeroWindow';
import { IntroPinned } from '@/components/home/IntroPinned';
import { SolutionsIndex } from '@/components/home/SolutionsIndex';
import { LightStudio } from '@/components/home/LightStudio';
import { ViaEmilia } from '@/components/home/ViaEmilia';
import { WorkPreview } from '@/components/home/WorkPreview';
import { ProcessRow } from '@/components/home/ProcessRow';
import { ClosingCta } from '@/components/home/ClosingCta';
import { Testimonials } from '@/components/Testimonials';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'GRtendaggi Concept — Tende e schermature su misura a Bologna',
  description:
    'Tende da sole, tende da interno, veneziane, zanzariere, pergotende e chiusure su misura a Bologna e in Emilia-Romagna. Consulenza, installazione e manutenzione.',
  path: '/',
});

export default function Home() {
  return (
    <>
      <HeroWindow />
      <IntroPinned />
      <SolutionsIndex />
      <LightStudio />
      <ViaEmilia />
      <WorkPreview />
      <ProcessRow />
      <Testimonials />
      <ClosingCta />
    </>
  );
}

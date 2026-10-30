import { imageRatio, imageSrc, imageWidths, type ImageKey } from '@/content/images';

type Props = {
  name: ImageKey;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
  /** Animazione d'ingresso: tendina dal basso. */
  wipe?: boolean;
};

// Immagine responsive con srcset WebP, dimensioni intrinseche (niente layout shift) e lazy loading.
export function Photo({ name, alt, sizes = '100vw', priority, className, imgClassName = '', style, wipe }: Props) {
  return (
    <div className={className} style={style} data-reveal={wipe ? 'wipe' : undefined}>
      <img
        src={imageSrc(name, 1600)}
        srcSet={imageWidths.map((w) => `${imageSrc(name, w)} ${w}w`).join(', ')}
        sizes={sizes}
        width={imageRatio.w}
        height={imageRatio.h}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={`block h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

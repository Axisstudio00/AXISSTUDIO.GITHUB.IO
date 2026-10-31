import { fallbackSrc, imageData, srcSet, type ImageId } from "@/lib/images";

type Props = {
  id: ImageId;
  sizes: string;
  priority?: boolean;
  alt?: string;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
};

export function Picture({ id, sizes, priority, alt, className, imgClassName, style }: Props) {
  const data = imageData(id);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(id, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(id, "webp")} sizes={sizes} />
      <img
        src={fallbackSrc(id)}
        width={data.width}
        height={data.height}
        alt={alt ?? data.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={imgClassName}
        style={{ backgroundColor: data.color, ...style }}
      />
    </picture>
  );
}

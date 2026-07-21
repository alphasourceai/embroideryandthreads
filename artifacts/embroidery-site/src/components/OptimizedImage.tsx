import { useEffect, useState, type ImgHTMLAttributes } from "react";
import PublicImage from "@/components/PublicImage";
import { versionedAssetUrl } from "@/lib/assets";

const useImageCdn = import.meta.env.VITE_NETLIFY_IMAGE_CDN === "true";

function imageCdnUrl(src: string, width: number) {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: "82",
  });

  return `/.netlify/images?${params.toString()}`;
}

type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  widths?: number[];
};

export default function OptimizedImage({
  src = "",
  widths = [480, 800, 1200],
  sizes = "100vw",
  onError,
  ...props
}: OptimizedImageProps) {
  const [cdnFailed, setCdnFailed] = useState(false);
  const versionedSrc = versionedAssetUrl(src);

  useEffect(() => {
    setCdnFailed(false);
  }, [versionedSrc]);

  if (!useImageCdn || !src.startsWith("/") || cdnFailed) {
    return (
      <PublicImage src={src} sizes={sizes} onError={onError} {...props} />
    );
  }

  const largestWidth = widths.at(-1) ?? 1200;
  const srcSet = widths
    .map((width) => `${imageCdnUrl(versionedSrc, width)} ${width}w`)
    .join(", ");

  return (
    <img
      src={imageCdnUrl(versionedSrc, largestWidth)}
      srcSet={srcSet}
      sizes={sizes}
      {...props}
      onError={() => setCdnFailed(true)}
    />
  );
}

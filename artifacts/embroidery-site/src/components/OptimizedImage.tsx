import type { ImgHTMLAttributes } from "react";

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
  ...props
}: OptimizedImageProps) {
  if (!useImageCdn || !src.startsWith("/")) {
    return <img src={src} sizes={sizes} {...props} />;
  }

  const largestWidth = widths.at(-1) ?? 1200;
  const srcSet = widths
    .map((width) => `${imageCdnUrl(src, width)} ${width}w`)
    .join(", ");

  return (
    <img
      src={imageCdnUrl(src, largestWidth)}
      srcSet={srcSet}
      sizes={sizes}
      {...props}
    />
  );
}

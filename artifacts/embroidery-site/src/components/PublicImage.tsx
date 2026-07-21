import {
  useEffect,
  useState,
  type ImgHTMLAttributes,
  type SyntheticEvent,
} from "react";
import { versionedAssetUrl } from "@/lib/assets";

export default function PublicImage({
  src = "",
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const versionedSrc = versionedAssetUrl(src);
  const [currentSrc, setCurrentSrc] = useState(versionedSrc);
  const [retried, setRetried] = useState(false);

  useEffect(() => {
    setCurrentSrc(versionedSrc);
    setRetried(false);
  }, [versionedSrc]);

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    if (!retried && src.startsWith("/")) {
      const separator = versionedSrc.includes("?") ? "&" : "?";
      setCurrentSrc(`${versionedSrc}${separator}retry=${Date.now()}`);
      setRetried(true);
      return;
    }

    onError?.(event);
  };

  return <img src={currentSrc} onError={handleError} {...props} />;
}

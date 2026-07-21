declare const __ASSET_VERSION__: string;

export const ASSET_VERSION = __ASSET_VERSION__;

export function versionedAssetUrl(src: string) {
  if (!src.startsWith("/") || src.startsWith("//")) return src;

  const url = new URL(src, "https://assets.local");
  url.searchParams.set("v", ASSET_VERSION);
  return `${url.pathname}${url.search}${url.hash}`;
}

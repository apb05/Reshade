import type { Metadata } from "next";
import { SITE } from "@/data/site";

/**
 * 1200×630 crop of jars-open.jpg, sized for link previews. Metadata URLs are
 * resolved against metadataBase (SITE.url), which already includes any base
 * path, so this must not go through asset().
 */
export const SOCIAL_IMAGE = {
  url: "/images/og-reshade.jpg",
  width: 1200,
  height: 630,
  alt: "Jars of ReShade paint made from recovered cosmetic pigments",
};

/**
 * Per-page metadata. Next.js replaces (rather than merges) openGraph and
 * twitter objects, so every page sets its own share title, description, URL
 * and canonical link here instead of inheriting the home page's.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const shareTitle = `${title} | ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_CA",
      url: path,
      title: shareTitle,
      description,
      images: [SOCIAL_IMAGE],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [SOCIAL_IMAGE] },
  };
}

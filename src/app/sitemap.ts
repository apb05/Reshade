import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/our-story", "/our-impact", "/shop", "/become-a-partner", "/contact"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p === "/become-a-partner" || p === "/shop" ? 0.9 : 0.7,
  }));
}

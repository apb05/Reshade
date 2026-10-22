export const SITE = {
  name: "ReShade Colours",
  shortName: "ReShade",
  tagline: "Beauty waste. Reimagined.",
  description:
    "ReShade is a student-led sustainability initiative with Enactus Humber Polytechnic that gives discarded and expired cosmetics a second life by repurposing their pigments into paint.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Only links that appear in the source presentations are listed here. */
  enactus: { name: "Enactus Humber Polytechnic", url: "https://www.enactushumber.com" },
  /**
   * Verified contact channels. The presentations do not publish an email
   * address, phone number or social accounts, so none are shown. Add them
   * here once confirmed and they will appear in the footer and Contact page.
   */
  contact: {
    email: null as string | null,
    socials: [] as { label: string; href: string }[],
  },
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/our-impact", label: "Our Impact" },
  { href: "/shop", label: "Shop Paint" },
  { href: "/contact", label: "Contact" },
] as const;

export const PARTNER_HREF = "/become-a-partner";

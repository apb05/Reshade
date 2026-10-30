import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";
import { Providers } from "@/components/layout/Providers";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { asset } from "@/lib/asset";
import { SOCIAL_IMAGE } from "@/lib/seo";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

const HOME_TITLE = "ReShade Colours: Beauty Waste. Reimagined.";
/** Search snippet length (~160 chars max); SITE.description is the longer version. */
const HOME_DESCRIPTION = "ReShade turns discarded and expired makeup into paint. A student-led sustainability initiative with Enactus Humber Polytechnic.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: HOME_TITLE, template: `%s | ${SITE.name}` },
  description: HOME_DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.enactus.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  alternates: { canonical: "/" },
  keywords: ["ReShade", "cosmetic waste", "recycled makeup", "paint", "pigment", "sustainability", "Enactus Humber", "circular economy"],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_CA",
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: HOME_DESCRIPTION, images: [SOCIAL_IMAGE] },
  other: { copyright: `© ${new Date().getFullYear()} ${SITE.name}, ${SITE.enactus.name}` },
  icons: { icon: asset("/icon.png"), apple: asset("/icon.png") },
};

export const viewport: Viewport = { themeColor: "#00265c", width: "device-width", initialScale: 1 };

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: `${SITE.url}/images/logo-reshade-dark.png`, width: 290, height: 290 },
    description: SITE.description,
    parentOrganization: { "@type": "Organization", name: SITE.enactus.name, url: SITE.enactus.url },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    headline: HOME_TITLE,
    inLanguage: "en-CA",
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = {
    checkoutEnabled: Boolean(process.env.STRIPE_SECRET_KEY),
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : null,
  };
  return (
    <html lang="en-CA" className={`${display.variable} ${sans.variable} ${serif.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers flags={flags}>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}

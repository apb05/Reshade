import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";
import { Providers } from "@/components/layout/Providers";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { asset } from "@/lib/asset";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "ReShade Colours — Beauty Waste. Reimagined.", template: "%s · ReShade Colours" },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["ReShade", "cosmetic waste", "recycled makeup", "paint", "pigment", "sustainability", "Enactus Humber", "circular economy", "custom paint"],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "ReShade Colours — Beauty Waste. Reimagined.",
    description: SITE.description,
    images: [{ url: asset("/images/jars-open.jpg"), width: 1580, height: 1709, alt: "Jars of ReShade paint made from recovered cosmetic pigments" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: asset("/icon.png"), apple: asset("/icon.png") },
};

export const viewport: Viewport = { themeColor: "#00265c", width: "device-width", initialScale: 1 };

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/images/logo-reshade-dark.png`,
  description: SITE.description,
  parentOrganization: { "@type": "Organization", name: SITE.enactus.name, url: SITE.enactus.url },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = {
    checkoutEnabled: Boolean(process.env.STRIPE_SECRET_KEY),
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : null,
  };
  return (
    <html lang="en-CA" className={`${display.variable} ${sans.variable} ${serif.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Providers flags={flags}>
          <DemoBanner />
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}

import Link from "next/link";
import { NAV, PARTNER_HREF, SITE } from "@/data/site";
import { Logo, EnactusLogo } from "@/components/ui/Logo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div className="container-x relative pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="light" className="h-20 w-auto" />
            <p className="mt-6 max-w-sm font-display text-3xl font-bold leading-tight tracking-tight">
              Beauty waste. <span className="text-yellow">Reimagined.</span>
            </p>
            <p className="mt-4 max-w-md text-white/70">
              Giving discarded cosmetics a second life by repurposing their pigments into paint.
            </p>
            <a href={SITE.enactus.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-white/10 px-4 py-3 transition hover:border-white/30">
              <span className="text-xs uppercase tracking-[0.18em] text-white/60">An initiative with</span>
              <EnactusLogo className="h-9 w-auto" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow text-yellow">Explore</p>
            <ul className="mt-5 space-y-3 text-lg">
              {[...NAV, { href: PARTNER_HREF, label: "Become a Partner" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-white/80 transition hover:text-yellow">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow text-yellow">Get in touch</p>
            <ul className="mt-5 space-y-3 text-lg">
              <li>
                <Link href="/contact" className="text-white/80 transition hover:text-yellow">Contact form</Link>
              </li>
              <li>
                <Link href={`${PARTNER_HREF}#inquiry`} className="text-white/80 transition hover:text-yellow">Partnership inquiry</Link>
              </li>
              {SITE.contact.email && (
                <li>
                  <a href={`mailto:${SITE.contact.email}`} className="text-white/80 transition hover:text-yellow">{SITE.contact.email}</a>
                </li>
              )}
              <li>
                <a href={SITE.enactus.url} target="_blank" rel="noopener noreferrer" className="text-white/80 transition hover:text-yellow">
                  enactushumber.com<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              {SITE.contact.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/80 transition hover:text-yellow">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div aria-hidden className="mt-20 flex h-2 overflow-hidden rounded-full">
          <span className="flex-1 bg-red" />
          <span className="flex-1 bg-yellow" />
          <span className="flex-1 bg-green" />
        </div>
        <div className="mt-6 flex flex-col justify-between gap-3 text-sm text-white/55 sm:flex-row">
          <p>© {year} ReShade Colours · Enactus Humber Polytechnic. All rights reserved.</p>
          <p>Digital colour previews are simulations; physical paint may vary.</p>
        </div>
      </div>
    </footer>
  );
}

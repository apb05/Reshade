import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { RevealWords, Reveal } from "@/components/ui/Motion";
import { EnactusLogo } from "@/components/ui/Logo";
import { PARTNER_HREF, SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ReShade — general questions, artist collaborations, volunteering and business partnerships.",
};

export default function ContactPage() {
  return (
    <section className="grain relative overflow-hidden bg-cream pb-24 pt-36 sm:pt-44">
      <div aria-hidden className="absolute -right-32 -top-32 size-[36rem] rounded-full bg-yellow/30 blur-3xl" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow text-red">Contact</p>
          <h1 className="mt-5 font-display text-display font-extrabold text-navy">
            <RevealWords text="Let’s talk colour." />
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-lede text-ink-soft">Questions, ideas, artist collaborations or volunteering — send us a message and the ReShade team will get back to you.</p>
          </Reveal>

          <Reveal delay={0.3}>
            <Link href={`${PARTNER_HREF}#inquiry`} className="group mt-10 block rounded-[2rem] bg-navy p-7 text-white transition hover:-translate-y-1">
              <p className="eyebrow text-yellow">Have cosmetics to supply?</p>
              <p className="mt-3 font-display text-2xl font-bold">Use the partnership inquiry form →</p>
              <p className="mt-2 text-sm text-white/70">It asks for the product details our team needs to assess eligibility, so you’ll hear back faster.</p>
            </Link>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-6">
                <p className="font-display text-lg font-bold">Artists</p>
                <p className="mt-1 text-sm text-ink-soft">We’re looking for artists to test ReShade paint and share feedback. Choose “Artist collaboration”.</p>
              </div>
              <div className="rounded-[2rem] bg-white p-6">
                <p className="font-display text-lg font-bold">Volunteers</p>
                <p className="mt-1 text-sm text-ink-soft">Help with outreach, research or communications. Choose “Volunteering”.</p>
              </div>
            </div>
            <div className="mt-6 rounded-[2rem] bg-white p-6">
              <p className="text-sm font-semibold">Find us online</p>
              <ul className="mt-3 space-y-2 text-sm">
                {SITE.contact.email && <li><a className="text-navy underline" href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a></li>}
                <li>
                  <a href={SITE.enactus.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-xl bg-navy px-3 py-2 text-white">
                    <EnactusLogo className="h-6 w-auto" /> enactushumber.com ↗<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
                {SITE.contact.socials.map((s) => (
                  <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" className="text-navy underline">{s.label}</a></li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

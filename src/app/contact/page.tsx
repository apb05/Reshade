import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/Motion";
import { EnactusLogo } from "@/components/ui/Logo";
import { ContactStudio } from "@/components/contact/ContactStudio";
import { SITE } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with ReShade by email: general questions, artist collaborations, volunteering and business partnerships.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      {SITE.contact.email && <ContactStudio email={SITE.contact.email} />}

      <section className="bg-paper py-16 sm:py-20">
        <Reveal className="container-x flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-lg font-serif text-2xl italic text-navy">
            ReShade is a student-led initiative of Enactus Humber Polytechnic.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={SITE.enactus.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-xl bg-navy px-4 py-3 text-sm text-white transition hover:-translate-y-0.5">
              <EnactusLogo className="h-6 w-auto" /> enactushumber.com ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
            {SITE.contact.socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-navy underline">{s.label}</a>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

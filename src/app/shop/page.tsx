import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShopHero } from "@/components/shop/ShopHero";
import { StudioJourney } from "@/components/shop/StudioJourney";
import { StudioCanvas, StudioHarmony, CurrentSwatch } from "@/components/shop/StudioExtras";
import { MyCollection } from "@/components/shop/MyCollection";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { Reveal, RevealWords } from "@/components/ui/Motion";
import { LinkButton } from "@/components/ui/Button";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Shop Paint — Create Your Own Colour",
  description:
    "Design a paint colour that’s entirely yours. Pick a shade on the interactive colour wheel, name it, give it meaning and see it on a personalised ReShade bottle — paint inspired by giving discarded cosmetics a second life.",
};

function SectionHead({ eyebrow, title, children, id }: { eyebrow: string; title: string; children?: React.ReactNode; id: string }) {
  return (
    <div className="mb-10 max-w-3xl sm:mb-14">
      <p className="eyebrow text-red">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-headline font-extrabold text-navy">
        <RevealWords text={title} />
      </h2>
      {children && <Reveal delay={0.15}><div className="mt-4 text-lede text-ink-soft">{children}</div></Reveal>}
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <ShopHero />
      <StudioJourney />

      <section aria-labelledby="harmony" className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHead eyebrow="Colour harmony" title="Colours that belong together." id="harmony">
              Suggestions generated from your current colour. Tap any swatch to load it into the wheel.
            </SectionHead>
            <div className="mb-10 lg:mb-14"><CurrentSwatch /></div>
          </div>
          <StudioHarmony />
        </div>
      </section>

      <section aria-labelledby="canvas-title" className="grain bg-cream py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-red">Paint preview studio</p>
            <h2 id="canvas-title" className="mt-3 font-display text-headline font-extrabold text-navy">See it on canvas.</h2>
            <p className="mt-4 text-lede text-ink-soft">Your creation is taking shape. Brush your shade across white, black, warm paper or neutral canvas to see how it feels before you commit.</p>
            <p className="mt-6 text-sm text-ink-soft">Strokes use the colour selected in the studio. Change your colour any time and keep painting.</p>
          </div>
          <StudioCanvas />
        </div>
      </section>

      <section aria-labelledby="collection-title" className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-red">Saved on this device</p>
              <h2 id="collection-title" className="mt-3 font-display text-headline font-extrabold text-navy">My Colour Collection.</h2>
            </div>
            <p className="max-w-sm text-ink-soft">Revisit, rename, duplicate or refine your creations any time. No account needed.</p>
          </div>
          <MyCollection />
        </div>
      </section>

      <section id="colours" aria-labelledby="colours-title" className="scroll-mt-24 bg-cream py-20 sm:py-28">
        <div className="container-x">
          <p className="eyebrow text-red">The ReShade palette</p>
          <h2 id="colours-title" className="mt-3 font-display text-headline font-extrabold text-navy">Explore our colours.</h2>
          <p className="mb-10 mt-4 max-w-2xl text-lede text-ink-soft">Shades made from recovered cosmetic pigments during ReShade’s product development with artists.</p>
          <ProductGallery />
        </div>
      </section>

      <section aria-labelledby="how-title" className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          <h2 id="how-title" className="max-w-3xl font-display text-headline font-extrabold text-navy">Honest about what we can make.</h2>
          <p className="mt-4 max-w-2xl text-lede text-ink-soft">The wheel can show millions of colours. Recovered cosmetic pigments can’t make all of them — so every creation follows one of two paths.</p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { tag: "Available", cls: "bg-green-soft text-green", title: "Confirmed colours", body: "Shades ReShade has confirmed it can produce, with confirmed sizes and prices. Personalise eligible paints and check out securely." },
              { tag: "Request custom colour", cls: "bg-yellow-soft text-navy", title: "Custom shade requests", body: "Any other colour you design is sent to our team for a feasibility review. No payment is taken until production, price and fulfilment are confirmed." },
              { tag: "Unavailable", cls: "bg-red-soft text-red", title: "Not possible yet", body: "Some shades may not be achievable with recovered pigments today. We’ll say so clearly and suggest adjusting your colour." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className="rounded-[1.75rem] bg-white p-7 shadow-[0_18px_50px_-34px_rgba(0,24,56,0.45)]">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${c.cls}`}>{c.tag}</span>
                <h3 className="mt-4 font-display text-2xl font-bold">{c.title}</h3>
                <p className="mt-2 text-ink-soft">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy text-white">
        <div className="container-x grid items-center gap-10 py-20 sm:py-28 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image src={asset("/images/pigment-process.jpg")} alt="Pressed blush being crushed and mixed into pink paint, then poured into a ReShade bottle" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow text-yellow">The added purpose</p>
            <h2 className="mt-3 font-display text-headline font-extrabold">Personal by design. Purposeful by nature.</h2>
            <p className="mt-5 text-lede text-white/75">
              ReShade paint starts life as discarded and expired makeup. We recover suitable pigments and give them a second life as art material — so the colour you create carries a story before you ever add yours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="#studio" variant="primary" arrow>Create My Paint</LinkButton>
              <LinkButton href="/our-story" variant="outline-light">Read our story</LinkButton>
            </div>
            <p className="mt-6 text-sm text-white/60">
              Questions about an order or a custom shade? <Link href="/contact" className="underline underline-offset-2 hover:text-yellow">Contact us</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

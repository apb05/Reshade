import type { Metadata } from "next";
import Image from "next/image";
import { BeforeAfter } from "@/components/partner/BeforeAfter";
import { ICONS } from "@/components/partner/Icons";
import { PartnerForm } from "@/components/forms/PartnerForm";
import { PartnerCTA } from "@/components/home/PartnerCTA";
import { LinkButton } from "@/components/ui/Button";
import { CountUp, Reveal, RevealWords } from "@/components/ui/Motion";
import { PaintStroke } from "@/components/ui/PaintStroke";
import { statById } from "@/data/impact";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Become a Partner — Give Your Cosmetic Waste a Second Life",
  description:
    "Cosmetic brands, retailers, manufacturers, distributors and salons: contribute eligible unwanted, expired or unsellable makeup to ReShade at no fee for accepted products, and help turn recovered pigments into paint.",
};

const STEPS = [
  { title: "Get in touch", body: "Tell us about your business, the cosmetics you’d like to provide, and roughly how much is available.", img: asset("/images/stage-makeup.jpg"), alt: "Unwanted pressed blush compacts" },
  { title: "Review the products", body: "The ReShade team assesses the product types, quantities, condition and suitability before anything moves.", img: asset("/images/lab-testing.jpg"), alt: "A ReShade team member testing a sample in a lab" },
  { title: "Arrange the transfer", body: "If accepted, we agree together how products will be transferred — including who handles any shipping or collection.", img: asset("/images/lab-equipment.jpg"), alt: "Prototype processing equipment from ReShade’s product development" },
  { title: "Give makeup a second life", body: "Suitable materials are directed into ReShade’s pigment recovery and paint development.", img: asset("/images/jars-open.jpg"), alt: "Open jars of ReShade paint in many colours" },
];

const WHO = [
  { key: "brand", title: "Cosmetic brands", body: "Discontinued shades and overstock." },
  { key: "retail", title: "Beauty retailers", body: "Expired or unsellable stock." },
  { key: "manufacturer", title: "Manufacturers", body: "Off-spec batches and production surplus." },
  { key: "distributor", title: "Cosmetic distributors", body: "Aged inventory and end-of-line product." },
  { key: "salon", title: "Salons & beauty businesses", body: "Expired or unused professional products." },
] as const;

const WHY = [
  { title: "Reduce avoidable disposal costs", body: "Explore a no-fee alternative for suitable cosmetic materials that would otherwise go to paid disposal.", colour: "bg-yellow" },
  { title: "Support circular innovation", body: "Help extend the useful life of materials that might otherwise be discarded.", colour: "bg-green" },
  { title: "Demonstrate environmental action", body: "Contribute to a practical, tangible sustainability initiative your team and customers can understand.", colour: "bg-red" },
  { title: "Empower student entrepreneurship", body: "Support students at Enactus Humber Polytechnic developing new answers to environmental and business challenges.", colour: "bg-navy" },
  { title: "Create new value", body: "Help turn unwanted cosmetic pigments into creative art materials.", colour: "bg-yellow" },
];

export default function PartnerPage() {
  const suppliers = statById("suppliers");
  const diverted = statById("diverted");
  return (
    <>
      {/* 1 — Hero */}
      <section className="relative overflow-hidden bg-navy pb-20 pt-32 text-white sm:pt-40">
        <div aria-hidden className="absolute -left-40 top-20 size-[40rem] rounded-full bg-navy-soft opacity-60 blur-3xl" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-yellow">For cosmetic businesses</p>
            <h1 className="mt-5 font-display text-display font-extrabold">
              <RevealWords text="Turn your cosmetic waste into something" />{" "}
              <span className="relative inline-block text-yellow">
                <RevealWords text="worthwhile." delay={0.4} />
              </span>
            </h1>
            <Reveal delay={0.3}>
              <p className="mt-7 max-w-xl text-lede text-white/85">
                <strong className="font-semibold text-white">Why pay to dispose of suitable unwanted cosmetics when they could have a second life?</strong> ReShade works with businesses to recover eligible makeup products and repurpose their pigments into paint.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <LinkButton href="#inquiry" variant="primary" size="lg" arrow>Partner With ReShade</LinkButton>
                <LinkButton href="#how-it-works" variant="outline-light" size="lg">How It Works</LinkButton>
              </div>
            </Reveal>
          </div>
          <BeforeAfter
            before={{ src: asset("/images/stage-makeup.jpg"), alt: "Unwanted pressed blush compacts, cracked and crumbling" }}
            after={{ src: asset("/images/stage-bottle.jpg"), alt: "The same pink pigment as finished paint in a ReShade bottle and jar" }}
            beforeLabel="Unwanted makeup"
            afterLabel="ReShade paint"
          />
        </div>
      </section>

      {/* 2 — Financial advantage */}
      <section aria-labelledby="money-title" className="grain bg-cream py-24 sm:py-32">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow text-red">The financial case</p>
              <h2 id="money-title" className="mt-4 font-display text-display font-extrabold text-navy">
                <RevealWords text="Stop paying to waste potential." />
              </h2>
            </div>
            <Reveal>
              <p className="text-lede text-ink-soft">
                Handling and disposing of unwanted cosmetic inventory can cost money. ReShade gives eligible businesses another option: contribute suitable unused or unsellable makeup, with no fee charged for the products we accept.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-[1fr_1.25fr]">
            <Reveal className="rounded-[2.5rem] border-2 border-ink/10 bg-white/60 p-8 sm:p-10">
              <p className="eyebrow text-ink-soft">Traditional disposal</p>
              <p className="mt-6 font-display text-6xl font-extrabold tracking-tight text-ink/40 line-through decoration-red decoration-4 sm:text-7xl">$ ? ? ?</p>
              <p className="mt-2 text-sm text-ink-soft">Costs vary by provider and volume.</p>
              <ul className="mt-8 space-y-4">
                {["May involve paid waste-management services", "Potentially useful materials are discarded", "Can require additional inventory handling"].map((t) => (
                  <li key={t} className="flex gap-3 text-ink-soft">
                    <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-ink/10 text-xs">✕</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="relative overflow-hidden rounded-[2.5rem] bg-navy p-8 text-white sm:p-10">
              <Image src={asset("/images/texture-yellow-paint.png")} alt="" aria-hidden width={700} height={717} className="pointer-events-none absolute -bottom-32 -right-24 w-80 opacity-70" />
              <p className="eyebrow relative text-yellow">Partnering with ReShade</p>
              <p className="relative mt-6 font-display text-[clamp(5rem,12vw,9rem)] font-extrabold leading-[0.85] tracking-tighter">
                $0
              </p>
              <p className="relative mt-3 max-w-sm font-display text-xl font-bold">ReShade fee for accepting approved cosmetic materials.</p>
              <ul className="relative mt-8 grid gap-4 sm:grid-cols-2">
                {["No fee for accepting approved cosmetic materials", "Divert suitable products from conventional waste streams", "Contribute to material reuse and circular innovation", "Support a student-led environmental initiative"].map((t) => (
                  <li key={t} className="flex gap-3 text-white/90">
                    <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-yellow text-xs font-bold text-navy">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal>
            <p className="mt-6 max-w-4xl rounded-2xl bg-white/70 px-5 py-4 text-sm text-ink-soft">
              <strong className="text-ink">Good to know:</strong> not every cosmetic product can be accepted. Eligibility, quantities and collection or shipping arrangements — including who covers any transport costs — are confirmed with you before any materials are accepted. ReShade doesn’t guarantee specific cost savings.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3 — Possibility */}
      <section aria-labelledby="possibility-title" className="overflow-hidden bg-paper py-24 sm:py-32">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-red">A second life for your products</p>
            <h2 id="possibility-title" className="mt-4 font-display text-display font-extrabold text-navy">
              <RevealWords text="What you see as waste," /> <span className="font-serif font-normal italic tracking-normal text-green"><RevealWords text="we see as possibility." delay={0.2} /></span>
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lede text-ink-soft">
                Expired or unsellable cosmetics can still hold pigments worth recovering. When your products are suitable, ReShade may recover those pigments and develop them into paint — and your business becomes part of a genuinely new approach to cosmetic waste.
              </p>
            </Reveal>
          </div>
          <ol className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { src: asset("/images/stage-makeup.jpg"), alt: "Unwanted blush compacts", label: "Unwanted" },
              { src: asset("/images/stage-crush.jpg"), alt: "Pigment being crushed with a palette knife", label: "Recovered" },
              { src: asset("/images/stage-paste.jpg"), alt: "Pigment mixed into a smooth pink paint", label: "Repurposed" },
              { src: asset("/images/stage-bottle.jpg"), alt: "Finished pink paint in a ReShade bottle", label: "Reimagined" },
            ].map((s, i) => (
              <Reveal as="li" key={s.src} delay={i * 0.12} className={i % 2 ? "md:mt-16" : ""}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem]">
                  <Image src={s.src} alt={s.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
                </div>
                <p className="mt-3 flex items-baseline gap-2 font-display text-xl font-bold text-navy">
                  <span className="font-mono text-xs text-red">0{i + 1}</span>
                  {s.label}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 — How it works */}
      <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 bg-navy py-24 text-white sm:py-32">
        <div className="container-x">
          <p className="eyebrow text-yellow">How partnership works</p>
          <h2 id="how-title" className="mt-4 max-w-3xl font-display text-display font-extrabold">
            <RevealWords text="Four simple steps." />
          </h2>
          <ol className="relative mt-20 space-y-20 before:absolute before:bottom-0 before:left-6 before:top-0 before:w-px before:bg-white/15 lg:space-y-28 lg:before:left-1/2">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative grid items-center gap-8 pl-16 lg:grid-cols-2 lg:gap-24 lg:pl-0">
                <span aria-hidden className="absolute left-0 top-0 grid size-12 place-items-center rounded-full bg-yellow font-display text-lg font-extrabold text-navy lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
                  {i + 1}
                </span>
                <Reveal className={i % 2 ? "lg:order-2" : "lg:text-right"}>
                  <p className="font-mono text-sm text-yellow">Step 0{i + 1}</p>
                  <h3 className="mt-2 font-display text-4xl font-bold">{s.title}</h3>
                  <p className={`mt-4 max-w-md text-lede text-white/75 ${i % 2 ? "" : "lg:ml-auto"}`}>{s.body}</p>
                </Reveal>
                <Reveal delay={0.1} className={i % 2 ? "lg:order-1" : ""}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
                    <Image src={s.img} alt={s.alt} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 — Who */}
      <section aria-labelledby="who-title" className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <h2 id="who-title" className="font-display text-display font-extrabold text-navy">
              <RevealWords text="If your business handles cosmetics, let’s talk." />
            </h2>
            <Reveal>
              <p className="text-lede text-ink-soft">
                We’re building ongoing supplier relationships for a reliable supply, and exploring larger partnerships with businesses that generate cosmetic waste at scale as our operations grow.
              </p>
            </Reveal>
          </div>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {WHO.map((w, i) => (
              <Reveal as="li" key={w.key} delay={i * 0.06} className="group rounded-[2rem] border-2 border-ink/5 bg-white p-6 transition-colors duration-500 hover:border-navy hover:bg-navy hover:text-white">
                <div className="size-12 text-red transition-colors group-hover:text-yellow">{ICONS[w.key]}</div>
                <h3 className="mt-6 font-display text-xl font-bold">{w.title}</h3>
                <p className="mt-2 text-sm text-ink-soft transition-colors group-hover:text-white/75">{w.body}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <div className="mt-10 flex flex-col gap-6 rounded-[2rem] bg-cream p-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-ink-soft">
                So far ReShade has engaged <strong className="text-ink"><CountUp value={suppliers.value} /> suppliers</strong> in green business practices and diverted <strong className="text-ink"><CountUp value={diverted.value} suffix="+" /> cosmetic products</strong> — as reported in our presentations.
              </p>
              <LinkButton href="#inquiry" variant="navy" arrow className="shrink-0">Start the conversation</LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 — Why */}
      <section aria-labelledby="why-title" className="grain bg-cream py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-red">Why partner with ReShade?</p>
            <h2 id="why-title" className="mt-4 font-display text-display font-extrabold text-navy">
              <RevealWords text="Good for your business." />
              <span className="relative block text-green">
                <RevealWords text="Better for the future." delay={0.15} />
              </span>
            </h2>
            <PaintStroke className="mt-6 h-6 w-64" color="var(--color-yellow)" />
          </div>
          <ol className="divide-y divide-ink/10 border-y border-ink/10">
            {WHY.map((w, i) => (
              <Reveal as="li" key={w.title} delay={i * 0.05} className="group grid grid-cols-[auto_1fr] gap-6 py-8">
                <span className={`mt-1 grid size-12 place-items-center rounded-full font-display text-lg font-extrabold ${w.colour} ${w.colour === "bg-yellow" ? "text-navy" : "text-white"} transition-transform duration-500 group-hover:scale-110`}>
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-navy sm:text-3xl">{w.title}</h3>
                  <p className="mt-2 max-w-xl text-ink-soft">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <p className="container-x mt-10 text-xs text-ink-soft">Partnering with ReShade does not guarantee specific ESG outcomes, regulatory compliance, certifications or cost savings.</p>
      </section>

      {/* 7 — Form */}
      <section id="inquiry" aria-labelledby="inquiry-title" className="scroll-mt-20 bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow text-red">Partnership inquiry</p>
            <h2 id="inquiry-title" className="mt-4 font-display text-display font-extrabold text-navy">
              <RevealWords text="Let’s give your products a second life." />
            </h2>
            <Reveal>
              <p className="mt-6 text-lede text-ink-soft">Tell us what you have. It takes about two minutes.</p>
              <ol className="mt-10 space-y-5">
                {["We review your inquiry and the products you describe.", "We follow up to confirm eligibility and any questions.", "If it’s a fit, we agree transfer arrangements together."].map((t, i) => (
                  <li key={t} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy font-semibold text-white">{i + 1}</span>
                    <span className="pt-1 text-ink-soft">{t}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-10 text-sm text-ink-soft">We only ask for what we need to respond to your inquiry.</p>
            </Reveal>
          </div>
          <PartnerForm />
        </div>
      </section>

      {/* 8 — Closing */}
      <PartnerCTA
        title="Let’s create something better together."
        body="Your unwanted cosmetics could help create something new. Partner with ReShade to explore a more creative future for cosmetic waste."
        cta="Start a Partnership"
        href="#inquiry"
      />
    </>
  );
}

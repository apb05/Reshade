import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { Reveal, RevealWords } from "@/components/ui/Motion";
import { PARTNER_HREF } from "@/data/site";
import { asset } from "@/lib/asset";

export function PartnerCTA({
  title = "Your unwanted makeup could become something extraordinary.",
  body = "Instead of sending suitable cosmetics to waste, explore how your business can give them a second life through ReShade.",
  cta = "Become a Partner",
  href = PARTNER_HREF,
}: { title?: string; body?: string; cta?: string; href?: string }) {
  return (
    <section aria-label="Partner with ReShade" className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image src={asset("/images/paint-pots-overhead.jpg")} alt="" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
      </div>
      <Image src={asset("/images/bottle-yellow.png")} alt="" aria-hidden width={444} height={882} className="pointer-events-none absolute -bottom-10 right-[6%] hidden h-[80%] w-auto rotate-6 drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)] lg:block" />
      <div className="container-x py-28 sm:py-36">
        <div className="max-w-3xl">
          <h2 className="font-display text-display font-extrabold"><RevealWords text={title} /></h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-lede text-white/80">{body}</p>
            <LinkButton href={href} variant="primary" size="lg" arrow className="mt-10">{cta}</LinkButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

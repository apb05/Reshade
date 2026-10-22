import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grain grid min-h-[80dvh] place-items-center bg-cream px-6 pt-28 text-center">
      <div>
        <p className="eyebrow text-red">404</p>
        <h1 className="mt-4 font-display text-display font-extrabold text-navy">This shade doesn’t exist yet.</h1>
        <p className="mx-auto mt-4 max-w-md text-lede text-ink-soft">The page you’re looking for has moved or never existed.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/" variant="navy" arrow>Back home</LinkButton>
          <LinkButton href="/shop" variant="outline">Create a colour</LinkButton>
        </div>
      </div>
    </section>
  );
}

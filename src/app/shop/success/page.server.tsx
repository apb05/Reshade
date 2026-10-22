import type { Metadata } from "next";
import Stripe from "stripe";
import { LinkButton } from "@/components/ui/Button";
import { ClearCartOnMount } from "@/components/shop/ClearCartOnMount";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

async function verify(sessionId?: string) {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const session = await new Stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid" ? session : null;
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const session = await verify(session_id);
  return (
    <section className="grain grid min-h-[80dvh] place-items-center bg-cream px-6 pt-28 text-center">
      <div className="max-w-xl">
        {session ? (
          <>
            <ClearCartOnMount />
            <p className="eyebrow text-green">Payment received</p>
            <h1 className="mt-4 font-display text-display font-extrabold text-navy">Your creation is on its way to life.</h1>
            <p className="mt-4 text-lede text-ink-soft">Thank you{session.customer_details?.name ? `, ${session.customer_details.name.split(" ")[0]}` : ""}. A receipt has been sent to {session.customer_details?.email ?? "your email"}.</p>
          </>
        ) : (
          <>
            <p className="eyebrow text-red">Hmm</p>
            <h1 className="mt-4 font-display text-display font-extrabold text-navy">We couldn’t confirm this order.</h1>
            <p className="mt-4 text-lede text-ink-soft">If you completed a payment, check your email for a Stripe receipt or contact us and we’ll look into it.</p>
          </>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/shop" variant="navy" arrow>Back to the studio</LinkButton>
          <LinkButton href="/contact" variant="outline">Contact us</LinkButton>
        </div>
      </div>
    </section>
  );
}

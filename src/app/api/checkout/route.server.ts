import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { findVariant, getShopConfig, isPurchasable } from "@/data/catalogue";
import { checkAvailability } from "@/data/colour-availability";
import { SITE } from "@/data/site";

const lineSchema = z.object({
  productId: z.string().max(60),
  variantId: z.string().max(80),
  qty: z.number().int().min(1).max(99),
  hex: z.string().regex(/^#[0-9A-F]{6}$/i),
  name: z.string().trim().max(28),
  message: z.string().trim().max(60).optional().default(""),
  personalised: z.boolean(),
});
const bodySchema = z.object({ lines: z.array(lineSchema).min(1).max(20) });

/**
 * Creates a Stripe Checkout Session. Prices are ALWAYS looked up on the
 * server from src/data/catalogue.ts — the client only says what it wants.
 * Card details are entered on Stripe's hosted page and never touch ReShade.
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: "Checkout isn’t live yet — payments haven’t been configured." }, { status: 503 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Your cart contains invalid items. Please review it and try again." }, { status: 400 });

  const config = getShopConfig();
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const metadata: Record<string, string> = { mode: config.mode };

  for (const [i, line] of parsed.data.lines.entries()) {
    const found = findVariant(config, line.productId, line.variantId);
    if (!found || found.variant.priceCents == null) {
      return NextResponse.json({ error: "One of your items is no longer available. Please remove it and try again." }, { status: 409 });
    }
    const { product, variant } = found;
    const unitAmount = variant.priceCents!; // null was rejected above

    if (product) {
      if (!isPurchasable(product)) return NextResponse.json({ error: `${product.name} isn’t available to buy right now.` }, { status: 409 });
      if (line.personalised && !product.personalisation.label) return NextResponse.json({ error: `${product.name} can’t be personalised yet.` }, { status: 409 });
      if (line.message && !product.personalisation.message) return NextResponse.json({ error: `Personal messages aren’t available for ${product.name}.` }, { status: 409 });
    } else {
      const availability = checkAvailability(line.hex);
      if (availability.status !== "available" || availability.match?.kind !== "formulation") {
        return NextResponse.json({ error: "This custom shade hasn’t been confirmed for production yet. Please request it instead." }, { status: 409 });
      }
    }

    const paintName = line.personalised ? `“${line.name || "Untitled"}”` : product?.name ?? "Custom shade";
    lineItems.push(
      variant.stripePriceId
        ? { price: variant.stripePriceId, quantity: line.qty }
        : {
            quantity: line.qty,
            price_data: {
              currency: config.currency,
              unit_amount: unitAmount,
              product_data: {
                name: `ReShade ${paintName} — ${variant.size}`,
                description: `${line.personalised ? "Personalised label. " : ""}Colour ${line.hex.toUpperCase()}${line.message ? ` · Message: ${line.message}` : ""}`.slice(0, 500),
              },
            },
          },
    );
    metadata[`line_${i}`] = [product?.id ?? "custom", variant.id, line.qty, line.hex.toUpperCase(), line.personalised ? line.name : "", line.message].join(" | ").slice(0, 500);
  }

  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      metadata,
      shipping_address_collection: { allowed_countries: ["CA"] },
      success_url: `${SITE.url}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/shop/cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "We couldn’t start checkout. Please try again shortly." }, { status: 502 });
  }
}

# Version 1 launch notes

## Version 1 is information only

The shop (colour studio, product gallery, cart, checkout) is **parked**, not deleted.
Its pages and API routes live in `src/parked/shop/`, outside `src/app/`, so Next.js does not build them:
`/shop`, `/shop/success`, `/shop/cancelled`, `/api/checkout` and `/api/colour-request` all return 404.
Nothing in the layout imports the cart, so no shop, cart or checkout code ships to the browser.

What remains: Home, Our Story, Our Impact, Become a Partner, Contact, and the contact and partner form APIs.

### Bringing the shop back

1. Move `src/parked/shop/app/shop` back to `src/app/shop`, and `src/parked/shop/api/*` back to `src/app/api/`.
2. Restore `{ href: "/shop", label: "Shop Paint" }` in `NAV` (`src/data/site.ts`).
3. In `src/app/layout.tsx`, render `<DemoBanner />` and `<CartDrawer />` again. In `SiteHeader.tsx`, restore the cart button. In `Providers.tsx`, restore the studio, collection and cart `persist.rehydrate()` calls (see git history).
4. Re-add `/shop` to `sitemap.ts`, the shop disallows to `robots.ts`, the home `<PersonalShowcase />` section, and any "Create your colour" links you want back.

Custom labels stay switched off with `FEATURES.customLabels` in `src/data/site.ts` even after the shop returns.
To offer them later (for example for bulk or corporate orders), set it to `true` and enable `personalisation` per product in `data/catalogue.ts`.

## Launch blockers (decisions or information needed)

| Item | Where | Notes |
| --- | --- | --- |
| Form delivery | Static: `NEXT_PUBLIC_FORM_ENDPOINT` (repo variable). Server: `INQUIRY_WEBHOOK_URL` or `RESEND_API_KEY` + `INQUIRY_TO_EMAIL` + `INQUIRY_FROM_EMAIL` | Without one of these, the contact and partner forms tell visitors their message was **not** sent. This is the main blocker for an information site. |
| Contact details | `SITE.contact` in `src/data/site.ts` | No verified email or social accounts are set, so none are shown. |
| Site URL | env `NEXT_PUBLIC_SITE_URL` | Used for the sitemap, robots and social sharing tags. Falls back to `http://localhost:3000` if unset. The GitHub Pages workflow sets it automatically. Set it for any other host or a custom domain. |
| Privacy policy | none | Recommended, since the forms collect names and email addresses. |
| Spam protection (optional) | env `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Forms have a honeypot and rate limit, but no captcha until these are set. |

## Waiting on Jamie: where content goes

**Copy** lives directly in the page and section files:

| Page | Files |
| --- | --- |
| Home | `src/components/home/*.tsx` (Hero, Problem, Transformation, PersonalShowcase, Creativity, ImpactHome, ProductShowcase, PartnerCTA) |
| Our Story | `src/app/our-story/page.tsx` |
| Our Impact | `src/app/our-impact/page.tsx`, figures and sources in `src/data/impact.ts` |
| Become a Partner | `src/app/become-a-partner/page.tsx` |
| Contact | `src/app/contact/page.tsx` |
| Site-wide tagline and description | `src/data/site.ts`, `src/app/layout.tsx` (default title and description) |

Each page's search title and description are in the `metadata` export at the top of its `page.tsx`.

**Images** are in `public/images/`. Replacing a file with one of the same name updates every place it is used. Please also update the matching `alt` text.

| File | Size (px) | Used in |
| --- | --- | --- |
| `jars-open.jpg` | 1580×1709 | Home hero, Story, Impact, Partner, social share image (`layout.tsx`) |
| `paint-pots-overhead.jpg` | 1490×983 | Home, Story, Partner CTA |
| `bottle-pink-table.jpg` | 1470×980 | Home product showcase |
| `bottle-pink-event.jpg` | 799×533 | Impact |
| `lab-equipment.jpg`, `lab-testing.jpg` | 800 wide | Partner, Home |
| `stage-makeup.jpg`, `stage-crush.jpg`, `stage-paste.jpg`, `stage-bottle.jpg` | 560×560 | Home transformation steps, Partner, Impact |
| `bottles-trio.jpg` | **383×388** | Home product showcase |
| `paint-night.jpg` | **279×179** | Home "Creativity", Impact |
| `bottle-pink.png`, `bottle-yellow.png` | 444×882 (cut-out) | Home hero, Partner CTA |
| `texture-yellow-paint.png` | 700×717 | Decorative texture |

The bold sizes are too small for sharp display on high-resolution screens. These should be the first ones replaced.
`pigment-process.jpg` and `public/images/bottle/*` are only used by the parked shop. Keep the bottle layers at their exact dimensions: they drive the live recolouring bottle.

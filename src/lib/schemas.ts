import { z } from "zod";

/** Shared between the browser (instant feedback) and the API (authoritative). */
const text = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`);
const required = (label: string, max: number) => text(max).min(1, `${label} is required.`);
const email = z.string().trim().max(160).email("Please enter a valid email address.");
const phone = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number.")
  .max(30)
  .regex(/^[+()\d\s.\-x]+$/i, "Please enter a valid phone number.");
const url = z
  .string()
  .trim()
  .max(200)
  .refine((v) => v === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i.test(v), "Please enter a valid web address.");
const consent = z.literal(true, { error: "Please confirm we may contact you about this." });
const hex = z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid colour.");

export const BUSINESS_TYPES = ["Cosmetic brand", "Beauty retailer", "Manufacturer", "Cosmetic distributor", "Salon or beauty business", "Other"] as const;
export const COSMETIC_TYPES = ["Pressed powders (eyeshadow, blush, bronzer)", "Loose powders & pigments", "Lipsticks & balms", "Liquid foundations & concealers", "Nail polish", "Mixed / not sure"] as const;
export const QUANTITIES = ["Fewer than 50 items", "50–250 items", "250–1,000 items", "1,000+ items", "Recurring supply", "Not sure yet"] as const;
export const INQUIRY_TYPES = ["General inquiry", "Business partnership", "Artist collaboration", "Volunteering", "Other"] as const;

export const partnerSchema = z.object({
  company: required("Company name", 120),
  contactName: required("Contact person", 100),
  email,
  phone,
  website: url.optional().default(""),
  businessType: z.enum(BUSINESS_TYPES, { error: "Please choose a business type." }),
  cosmeticTypes: z.array(z.enum(COSMETIC_TYPES)).min(1, "Please choose at least one product type."),
  quantity: z.enum(QUANTITIES, { error: "Please choose an estimated quantity." }),
  location: required("Location", 120),
  details: text(2000).optional().default(""),
  consent,
});

export const contactSchema = z.object({
  name: required("Name", 100),
  email,
  inquiryType: z.enum(INQUIRY_TYPES, { error: "Please choose an inquiry type." }),
  message: required("Message", 3000).min(10, "Please tell us a little more (10+ characters)."),
  consent,
});

export const colourRequestSchema = z.object({
  name: required("Name", 100),
  email,
  colourName: text(28).optional().default(""),
  hex,
  quantity: z.coerce.number().int().min(1).max(500),
  notes: text(1000).optional().default(""),
  includeStory: z.boolean().optional().default(false),
  story: text(160).optional().default(""),
  consent,
});

export type PartnerInput = z.input<typeof partnerSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type ColourRequestInput = z.input<typeof colourRequestSchema>;

/** Anti-spam fields every public form sends alongside its data. */
export const guardSchema = z.object({
  /** Honeypot — must be empty */
  fax: z.string().max(500).optional().default(""),
  /** ms timestamp when the form was first rendered */
  startedAt: z.number().int(),
  turnstileToken: z.string().max(4096).optional(),
});

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

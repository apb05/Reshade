import { partnerSchema } from "@/lib/schemas";
import { handleForm } from "@/lib/server/handle-form";

export async function POST(req: Request) {
  return handleForm(req, partnerSchema, (d) => ({
    kind: "partner-inquiry",
    subject: `Partnership inquiry — ${d.company}`,
    replyTo: d.email,
    fields: {
      Company: d.company,
      "Contact person": d.contactName,
      Email: d.email,
      Phone: d.phone,
      Website: d.website || "—",
      "Business type": d.businessType,
      "Cosmetics available": d.cosmeticTypes,
      "Estimated quantity": d.quantity,
      Location: d.location,
      "Additional information": d.details || "—",
      "Consent to contact": d.consent,
    },
  }));
}

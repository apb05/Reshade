import { contactSchema } from "@/lib/schemas";
import { handleForm } from "@/lib/server/handle-form";

export async function POST(req: Request) {
  return handleForm(req, contactSchema, (d) => ({
    kind: "contact",
    subject: `${d.inquiryType} — ${d.name}`,
    replyTo: d.email,
    fields: { Name: d.name, Email: d.email, "Inquiry type": d.inquiryType, Message: d.message, "Consent to contact": d.consent },
  }));
}

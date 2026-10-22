import { colourRequestSchema } from "@/lib/schemas";
import { handleForm } from "@/lib/server/handle-form";

export async function POST(req: Request) {
  return handleForm(req, colourRequestSchema, (d) => ({
    kind: "colour-request",
    subject: `Custom shade request — ${d.colourName || d.hex}`,
    replyTo: d.email,
    fields: {
      Name: d.name,
      Email: d.email,
      "Colour name": d.colourName || "—",
      HEX: d.hex.toUpperCase(),
      "Bottles requested": d.quantity,
      Notes: d.notes || "—",
      "Colour story (shared by customer)": d.includeStory && d.story ? d.story : "— not shared —",
      "Consent to contact": d.consent,
    },
  }));
}

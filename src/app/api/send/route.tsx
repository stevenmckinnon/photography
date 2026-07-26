import { Resend } from "resend";

import EmailTemplate from "@/components/emails/contact";
import { DATA } from "@/data/resume";
import { contactSchema } from "@/lib/contact-schema";
import { checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for');
  const withinLimit = await checkRateLimit(ip ?? 'anonymous');

  if (!withinLimit) {
    return new Response('Too many requests', { status: 429 });
  }

  // Validate server-side too — the client schema can't be trusted.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message, shootType, preferredDate, instagram } =
    parsed.data;

  const emailBody = (
    <EmailTemplate
      message={message}
      name={name}
      email={email}
      shootType={shootType}
      preferredDate={preferredDate}
      instagram={instagram}
    />
  );

  try {
    const { data, error } = await resend.emails.send({
      // Sender must stay on the verified domain; the visitor's address goes in
      // replyTo so hitting reply in the mail client just works.
      from: `${DATA.name} Photography <noreply@stevenmckinnon.co.uk>`,
      replyTo: email,
      to: [DATA.contact.email],
      subject: `Photography enquiry — ${shootType} — ${name}`,
      react: emailBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Failed to send" }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json({ error: "Failed to send" }, { status: 500 });
  }
}

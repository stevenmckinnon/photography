import { Resend } from "resend";
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import EmailTemplate from "@/components/emails/contact";
import type { ReactElement } from "react";
import { DATA } from "@/data/resume";

const resend = new Resend(process.env.RESEND_API_KEY);

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for');
  const { success } = await ratelimit.limit(ip ?? 'anonymous');
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }

  try {
    const { name, email, message, subject, instagram } = await request.json();
    const { data, error } = await resend.emails.send({
      from: `${name} <noreply@stevenmckinnon.co.uk>`,
      to: [DATA.contact.email],
      subject: subject,
      react: EmailTemplate({ message, name, email, subject, instagram }) as ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

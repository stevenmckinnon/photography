import Link from "next/link";

import { DATA } from "@/data/resume";

export function Footer() {
  const socials = Object.entries(DATA.contact.social).filter(
    ([, social]) => social.footer
  );

  return (
    <footer className="w-full border-t bg-muted/10 py-12">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <span className="font-heading text-xl font-bold tracking-tighter">
            {DATA.name}
          </span>
          <p className="font-body text-sm text-muted-foreground">
            {DATA.role.charAt(0).toUpperCase() + DATA.role.slice(1)} &middot;{" "}
            {DATA.location}
          </p>
          <Link
            href={`mailto:${DATA.contact.email}`}
            className="font-body text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {DATA.contact.email}
          </Link>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex gap-5">
            {socials.map(([name, social]) => (
              <Link
                key={name}
                href={social.url}
                target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <social.icon className="size-5" />
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
          {/* No year: the page is statically cached, so a rendered year goes
              stale, and the copyright is valid without one. */}
          <p className="font-body text-sm text-muted-foreground">
            &copy; {DATA.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

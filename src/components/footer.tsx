"use client";

import Link from "next/link";
import { DATA } from "@/data/resume";
import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState(2025);
  // I would rather not use this but it's the only way to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full py-12 border-t bg-muted/10">
      <div className="container max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-xl font-heading font-bold tracking-tighter">
            {DATA.name}
          </span>
          <p className="text-sm text-muted-foreground font-body">
            &copy; {year} All rights reserved.
          </p>
        </div>

        <div className="flex gap-6">
          {Object.entries(DATA.contact.social).map(([name, social]) => (
            <Link
              key={name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <social.icon className="size-5" />
              <span className="sr-only">{social.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

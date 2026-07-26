import Link from "next/link";

import { DATA } from "@/data/resume";

/**
 * Compact header for inner pages. The homepage uses the full hero instead.
 */
export function SiteHeader() {
  return (
    <header className="flex justify-center py-8">
      <Link
        href="/"
        className="font-heading text-xl font-bold tracking-tighter transition-opacity hover:opacity-70"
      >
        {DATA.name}
      </Link>
    </header>
  );
}

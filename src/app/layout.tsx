import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { ScrollProgress } from "@/components/magicui/scroll-progress";

import "./globals.css";
import { Footer } from "@/components/footer";

const fontHeading = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: `${DATA.name} Photography`,
    template: `%s | ${DATA.name} Photography`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name} Photography`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name} Photography`,
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: DATA.ogImage,
        width: 1200,
        height: 630,
        alt: `Photography by ${DATA.name}`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name} Photography`,
    description: DATA.description,
    card: "summary_large_image",
    images: [DATA.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        {/* Literal colours — `var()` does not resolve in meta content. These
            mirror --background in globals.css for light and dark. */}
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#e8ebed"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#1c2433"
        />
      </head>

      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased selection:bg-primary selection:text-primary-foreground",
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <ThemeProvider enableSystem attribute="class" defaultTheme="dark">
          <TooltipProvider delayDuration={0}>
            <ScrollProgress className="top-0" />
            <div className="fixed inset-0 z-[-1] bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
            <div className="max-w-7xl mx-auto py-2 sm:py-4 px-6">
              <main className="flex flex-col h-full">{children}</main>
              <Footer />
              <Navbar />
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

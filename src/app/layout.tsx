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
import BlurFade from "@/components/magicui/blur-fade";
import { Footer } from "@/components/footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
    locale: "en_US",
    type: "website",
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
    card: "summary_large_image",
  },
  verification: {
    google: "",
    yandex: "",
  },
};

const BLUR_FADE_DELAY = 0.04;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="var(--background)" />
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
              <main className="flex flex-col h-full">
                <section
                  id="hero"
                  className="relative min-h-[60vh] flex flex-col justify-center items-center text-center"
                >
                  <div className="w-full max-w-5xl space-y-8">
                    <div className="flex flex-col items-center gap-6">
                      <BlurFade delay={BLUR_FADE_DELAY}>
                        <Avatar className="size-32 border-2 rounded-full border-primary/20 shadow-2xl ring-4 ring-background">
                          <AvatarImage
                            alt={DATA.name}
                            src={DATA.avatarUrl}
                            className="object-cover transition-all duration-500"
                          />
                          <AvatarFallback>{DATA.initials}</AvatarFallback>
                        </Avatar>
                      </BlurFade>
                      <BlurFade delay={BLUR_FADE_DELAY * 2}>
                        <h1 className="text-4xl font-heading font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                          {DATA.name}
                        </h1>
                      </BlurFade>
                      <BlurFade delay={BLUR_FADE_DELAY * 2}>
                        <p className="prose max-w-lg text-pretty font-body text-xl text-muted-foreground dark:prose-invert leading-relaxed tracking-wide">
                          Glasgow based lifestyle and portrait photographer
                          capturing moments of raw authenticity.
                        </p>
                      </BlurFade>
                    </div>
                  </div>
                </section>
                {children}
              </main>
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

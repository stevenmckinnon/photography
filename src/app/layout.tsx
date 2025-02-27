import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ScrollProgress } from "@/components/magicui/scroll-progress";

import "./globals.css";
import BlurFade from "@/components/magicui/blur-fade";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
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

      <body className={cn(fontSans.variable)}>
        <div className="min-h-screen bg-background font-sans antialiased max-w-7xl mx-auto py-12 sm:py-24 px-6">
          <ThemeProvider enableSystem attribute="class" defaultTheme="light">
            <TooltipProvider delayDuration={0}>
              <ScrollProgress className="top-0" />
              <main className="flex flex-col h-full space-y-10">
                <section id="hero">
                  <div className="mx-auto w-full max-w-2xl space-y-8">
                    <div className="gap-4 flex flex-col items-center justify-between">
                      <BlurFade delay={BLUR_FADE_DELAY}>
                        <Avatar className="size-28 border">
                          <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                          <AvatarFallback>{DATA.initials}</AvatarFallback>
                        </Avatar>
                      </BlurFade>
                      <BlurFade delay={BLUR_FADE_DELAY * 2}>
                        <h1 className="flex items-center justify-center text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                          <AuroraText className="pr-[1px] pl-[1px]">
                            {DATA.name}
                          </AuroraText>
                        </h1>
                      </BlurFade>
                      <BlurFade delay={BLUR_FADE_DELAY * 3}>
                        <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                          Glasgow based lifestyle and portrait photographer
                        </p>
                      </BlurFade>
                    </div>
                  </div>
                </section>
                {children}
              </main>
              <Navbar />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}

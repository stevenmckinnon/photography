import { AuroraText } from "@/components/magicui/aurora-text";
import BlurFade from "@/components/magicui/blur-fade";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import ImageGrid from "@/components/image-grid";
import { Metadata } from "next";

const BLUR_FADE_DELAY = 0.04;

export const metadata: Metadata = {
  title: "Photography Portfolio | Steve McKinnon",
  description: "Glasgow based lifestyle and portrait photographer",
  openGraph: {
    images: ["path/to/og-image.jpg"],
  },
};

export default function Page() {
  return (
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
      <section id="location">
        <ImageGrid />
      </section>
      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 10}>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl">
                Want to work together?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Just shoot me an email and we can chat about your ideas.
              </p>
              <RainbowButton href="/contact">Contact me</RainbowButton>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}

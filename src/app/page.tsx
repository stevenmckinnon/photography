import BlurFade from "@/components/magicui/blur-fade";
import { RainbowButton } from "@/components/magicui/rainbow-button";
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
    <>
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
    </>
  );
}

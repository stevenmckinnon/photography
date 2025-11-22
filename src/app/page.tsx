import ImageGrid from "@/components/image-grid";
import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export const metadata: Metadata = {
  title: "Steve McKinnon Photography",
  description: "Glasgow based lifestyle and portrait photographer",
  openGraph: {
    images: ["path/to/og-image.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <section id="location" className="pb-24">
        <ImageGrid />
      </section>

      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-24">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex flex-col gap-6 items-center">
              <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl">
                Ready to create?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Whether you have a specific concept or just a vague idea,
                I&apos;d love to hear from you.
              </p>
              <Button
                asChild
                size="lg"
                className="text-lg transition-all hover:scale-105"
              >
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>
    </>
  );
}

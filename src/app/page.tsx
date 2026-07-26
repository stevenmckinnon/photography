import ImageGrid from "@/components/image-grid";
import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <>
      <section
        id="hero"
        className="relative flex min-h-[45vh] flex-col items-center justify-center pb-12 pt-8 text-center"
      >
        <div className="flex flex-col items-center gap-6">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <Avatar className="size-28 rounded-full border-2 border-primary/20 shadow-2xl ring-4 ring-background">
              <AvatarImage
                alt={`${DATA.name}, ${DATA.role}`}
                src={DATA.avatarUrl}
                className="object-cover"
              />
              <AvatarFallback>{DATA.initials}</AvatarFallback>
            </Avatar>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <h1 className="font-heading text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
              {DATA.name}
            </h1>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <p className="max-w-lg text-pretty font-body text-xl leading-relaxed tracking-wide text-muted-foreground">
              {DATA.tagline}
            </p>
          </BlurFade>
        </div>
      </section>

      <section id="work" className="pb-20">
        <h2 className="sr-only">Selected work</h2>
        <ImageGrid />
      </section>

      <section id="contact">
        <div className="grid w-full items-center justify-center gap-4 px-4 py-20 text-center md:px-6">
          <BlurFade delay={BLUR_FADE_DELAY * 3} inView>
            <div className="flex flex-col items-center gap-6">
              <h2 className="font-heading text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to create?
              </h2>
              <p className="mx-auto max-w-[600px] font-body text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Whether you have a specific concept or just a vague idea,
                I&apos;d love to hear from you.
              </p>
              <Button
                asChild
                size="lg"
                className="text-lg transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.96] motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
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

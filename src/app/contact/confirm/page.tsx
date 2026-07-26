"use client";

import { useRef } from "react";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";

import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";
import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";

const BLUR_FADE_DELAY = 0.04;

const Page = () => {
  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <section id="contact">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <BadgeCheck className="size-16 text-green-500" />
          </BlurFade>
          <BlurFade
            delay={BLUR_FADE_DELAY * 2}
            className="flex flex-col gap-2 text-center"
          >
            <h1 className="relative font-heading text-2xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
              Message sent
            </h1>
            <p className="text-lg text-muted-foreground">
              Thanks for getting in touch — I&apos;ll reply within two working
              days.
            </p>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <Button
              asChild
              className="mt-4 transition-transform duration-150 ease-out active:scale-[0.96] motion-reduce:active:scale-100"
            >
              <Link href="/">Back to the work</Link>
            </Button>
          </BlurFade>
          <Confetti
            ref={confettiRef}
            className="absolute left-0 top-0 z-0 size-full pointer-events-none"
            onMouseEnter={() => {
              confettiRef.current?.fire({});
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;

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
    <main className="flex flex-col h-full space-y-10">
      <section id="contact">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
            <BlurFade delay={BLUR_FADE_DELAY}>
              <BadgeCheck className="size-16 text-green-500" />
            </BlurFade>
            <BlurFade
              delay={BLUR_FADE_DELAY * 2}
              className="flex flex-col gap-2 text-center"
            >
              <h1 className="relative text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Message sent
              </h1>
              <p className="text-lg">
                Thank you for getting in touch. I'll get back to you as soon as
                possible!
              </p>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <Button asChild className="mt-4">
                <Link href="/">Go back to home</Link>
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
    </main>
  );
};

export default Page;

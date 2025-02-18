import Link from "next/link";
import Markdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

import { AuroraText } from "@/components/magicui/aurora-text";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import ImageGrid from "@/components/image-grid";
const BLUR_FADE_DELAY = 0.04;

export default async function Page() {
  const supabase = await createClient();

  // Get all files from the photography bucket
  const { data: files } = await supabase.storage.from("photography").list();
  // Get public URLs for each file
  const photos = files?.map((file) => ({
    ...file,
    url: supabase.storage.from("photography").getPublicUrl(file.name).data
      .publicUrl,
  }));

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
        <ImageGrid photos={photos?.map(({ url, name }) => ({ url, name }))} />
      </section>
      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 10}>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Want to chat? Just shoot me an email&nbsp;
              </p>
              <RainbowButton href="/contact">Contact me</RainbowButton>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}

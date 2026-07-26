"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { useToast } from "@/hooks/use-toast";
import { DATA } from "@/data/resume";
import {
  MESSAGE_LIMIT,
  SHOOT_TYPES,
  contactSchema,
  type ContactFormData,
} from "@/lib/contact-schema";

/** Character count stays hidden until the limit is actually in play. */
const COUNTER_VISIBLE_FROM = 800;

const BLUR_FADE_DELAY = 0.04;

const inputStyles = cn(
  "h-11 bg-background/50 backdrop-blur-xs transition-colors duration-200",
  "focus:ring-2 ring-offset-2 ring-offset-background"
);

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      shootType: undefined,
      preferredDate: "",
      message: "",
      instagram: "",
    },
  });

  const onSubmit = async (formData: ContactFormData) => {
    try {
      setLoading(true);

      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/contact/confirm");
      } else {
        toast({
          title: "Your message didn't send",
          description:
            response.status === 429
              ? "Too many messages from this connection. Please try again later."
              : `Please try again, or email ${DATA.contact.email} directly.`,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Your message didn't send",
        description: `Please check your connection, or email ${DATA.contact.email} directly.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const messageLength = form.watch("message")?.length ?? 0;

  return (
    <section
      id="contact"
      className="min-h-screen px-0 pb-16 pt-4 md:px-4"
    >
      <div className="mx-auto w-full max-w-2xl space-y-10">
        <div className="space-y-4 text-center">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <h1 className="font-heading text-3xl font-bold tracking-tighter sm:text-5xl">
              Get in touch
            </h1>
          </BlurFade>
          <BlurFadeText
            className="text-lg text-muted-foreground"
            wrapperClassName="justify-center"
            delay={BLUR_FADE_DELAY}
            text="Tell me what you have in mind and I'll reply within two working days."
          />
        </div>

        <Form {...form}>
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="rounded-2xl border bg-card/50 p-6 shadow-lg backdrop-blur-xs">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <div className="grid gap-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Name</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="name"
                              placeholder="Jamie Bell"
                              className={cn(
                                inputStyles,
                                form.formState.errors[field.name] &&
                                  "border-destructive"
                              )}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder="jamie@example.com"
                              className={cn(
                                inputStyles,
                                form.formState.errors[field.name] &&
                                  "border-destructive"
                              )}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="shootType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Shoot type</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              value={field.value ?? ""}
                              className={cn(
                                inputStyles,
                                "w-full rounded-md border border-input px-3 text-sm",
                                "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
                                !field.value && "text-muted-foreground",
                                form.formState.errors[field.name] &&
                                  "border-destructive"
                              )}
                            >
                              <option value="" disabled>
                                Choose one
                              </option>
                              {SHOOT_TYPES.map((type) => (
                                <option
                                  key={type}
                                  value={type}
                                  className="text-foreground"
                                >
                                  {type}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel optional>Preferred date</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Early March, or flexible"
                              className={inputStyles}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Message</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Location, mood, how many people, anything you've already got in mind."
                              rows={5}
                              className={cn(
                                inputStyles,
                                "h-auto",
                                form.formState.errors[field.name] &&
                                  "border-destructive"
                              )}
                              {...field}
                              maxLength={MESSAGE_LIMIT}
                            />
                            {messageLength >= COUNTER_VISIBLE_FROM && (
                              <span
                                aria-live="polite"
                                className={cn(
                                  "absolute bottom-2 right-2 text-xs tabular-nums",
                                  messageLength >= MESSAGE_LIMIT
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                                )}
                              >
                                {messageLength}/{MESSAGE_LIMIT}
                              </span>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel optional>Instagram</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="@yourhandle"
                            className={inputStyles}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="transition-transform duration-150 ease-out active:scale-[0.96] motion-reduce:active:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <MailOpen className="size-4" strokeWidth={1.5} />
                        <span>Send message</span>
                      </>
                    )}
                  </Button>
                  <p className="font-body text-sm text-muted-foreground">
                    Or email{" "}
                    <a
                      href={`mailto:${DATA.contact.email}`}
                      className="underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                      {DATA.contact.email}
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </BlurFade>
        </Form>
      </div>
    </section>
  );
};

export default Page;

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  instagram: z
    .string()
    .optional()
    .transform((val) => val || undefined),
});

export type ContactFormData = z.infer<typeof schema>;

const BLUR_FADE_DELAY = 0.04;
// Common input styles
const inputStyles = cn(
  "h-11 bg-background/50 backdrop-blur-xs transition-all duration-200",
  "focus:ring-2 ring-offset-2 ring-offset-background"
);

const Page = () => {
  const router = useRouter();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      instagram: "",
    },
  });

  const onSubmit = async (formData: ContactFormData) => {
    try {
      setLoading(true); // Set loading to true when starting the async operation

      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          instagram: formData.instagram,
        }),
      });

      if (response.ok) {
        router.push("/contact/confirm");
      } else {
        toast({
          title: "Error sending email:",
          description: response.statusText,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error sending email:",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Set loading back to false after the async operation completes
    }
  };

  const formProgress = Object.keys(form.formState.dirtyFields).length;
  const totalFields = Object.keys(schema.shape).length;

  return (
    <section
      id="contact"
      className="min-h-screen pb-16 pt-8 px-0 animate-in slide-in-from-bottom-4 duration-700 md:px-4"
    >
      <div className="mx-auto w-full max-w-2xl space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Contact Me
            </h2>
          </BlurFade>
          <BlurFadeText
            className="text-lg text-muted-foreground"
            wrapperClassName="justify-center"
            delay={BLUR_FADE_DELAY}
            text="Drop me a message and I'll get back to you as soon as possible."
          />
        </div>

        {/* Form Section */}
        <Form {...form}>
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="bg-card/50 backdrop-blur-xs rounded-lg p-6 shadow-lg border relative overflow-hidden">
              {/* Form Progress Indicator */}
              <div className="w-full bg-muted h-1 rounded-full overflow-hidden absolute top-0 left-0">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(formProgress / totalFields) * 100}%` }}
                />
              </div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <div className="grid gap-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel required className="text-sm font-medium">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="name"
                              placeholder="Your name"
                              required
                              className={cn(
                                inputStyles,
                                field.value && "border-primary/50",
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
                              placeholder="Your email"
                              required
                              className={cn(
                                inputStyles,
                                field.value && "border-primary/50",
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
                  <div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Subject"
                              required
                              className={cn(
                                inputStyles,
                                field.value && "border-primary/50",
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
                  <div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Message</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Your message"
                                required
                                className={cn(
                                  inputStyles,
                                  field.value && "border-primary/50",
                                  form.formState.errors[field.name] &&
                                    "border-destructive"
                                )}
                                {...field}
                                maxLength={1000}
                              />
                              <span
                                className={cn(
                                  "absolute bottom-2 right-2 text-xs",
                                  field.value.length > 900
                                    ? "text-warning"
                                    : "text-muted-foreground"
                                )}
                              >
                                {field.value.length}/1000
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel optional>Instagram</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Instagram"
                              className={cn(
                                inputStyles,
                                field.value && "border-primary/50",
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
                </div>
                <Button type="submit" disabled={loading} size="lg">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MailOpen className="h-4 w-4" />
                      <span>Send Message</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </BlurFade>
        </Form>
      </div>
    </section>
  );
};

export default Page;

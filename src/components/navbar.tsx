"use client";

import { useState, useEffect, useRef } from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
import useBreakpoint from "@/hooks/useBreakpoints";

export default function Navbar() {
  const { isBelowMd } = useBreakpoint("md");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldHideNavbar, setShouldHideNavbar] = useState(false);
  const scrollingRef = useRef(false);

  // Track scroll position and direction to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      if (scrollingRef.current) return;

      scrollingRef.current = true;

      // Use requestAnimationFrame for smoother performance
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (isBelowMd) {
          // Only apply hide/show behavior on small viewports
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down & past initial threshold - hide navbar
            setShouldHideNavbar(true);
          } else {
            // Scrolling up or at top - show navbar
            setShouldHideNavbar(false);
          }
        } else {
          // Always show navbar on larger viewports
          setShouldHideNavbar(false);
        }

        setLastScrollY(currentScrollY);
        scrollingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isBelowMd]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto pb-4 flex origin-bottom h-full max-h-[4.5rem]",
        "transition-transform duration-300",
        // Apply transform when shouldHideNavbar is true and viewport is small
        isBelowMd && shouldHideNavbar ? "translate-y-[90%]" : "translate-y-0"
      )}
    >
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
        {DATA.navbar.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12",
                    "rounded-tl-[290px] rounded-tr-md rounded-br-md rounded-bl-[290px]"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12"
                    )}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{social.name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
}

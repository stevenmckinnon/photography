"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const ModeToggle = forwardRef<HTMLButtonElement>((_, ref) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      ref={ref}
      variant="ghost"
      type="button"
      size="icon"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "size-12",
        "rounded-tr-[290px] rounded-tl-md rounded-bl-md rounded-br-[290px] cursor-pointer"
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] text-foreground dark:hidden" />
      <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] dark:block text-foreground" />
    </Button>
  );
});

ModeToggle.displayName = "ModeToggle";

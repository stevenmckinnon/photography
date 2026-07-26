import { Icons } from "@/components/icons";
import type { Info } from "@/types/resume";
import { HomeIcon, MailIcon } from "lucide-react";

export const DATA: Info = {
  name: "Steve McKinnon",
  initials: "SM",
  // This site is served from stevenmckinnon.co.uk; stevemckinnon.co.uk (no
  // "n") is the separate software-development portfolio linked below.
  url: "https://stevenmckinnon.co.uk",
  role: "lifestyle and portrait photographer",
  location: "Glasgow, Scotland",
  tagline:
    "Glasgow based lifestyle and portrait photographer capturing moments of raw authenticity.",
  description:
    "Lifestyle and portrait photography by Steve McKinnon, based in Glasgow, Scotland. Studio portraits, editorial and live event work.",
  // Social preview image. Built from the lead gallery image so shares show
  // actual work rather than a placeholder.
  ogImage:
    "https://res.cloudinary.com/daohij8fu/image/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/20240907-Hils-1_n6q8p9",
  avatarUrl: "/me.jpg",
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/contact", icon: MailIcon, label: "Contact" },
  ],
  contact: {
    email: "hello@stevenmckinnon.co.uk",
    tel: "+447753232305",
    social: {
      Instagram: {
        name: "Instagram",
        url: "https://instagram.com/stevenmckinnon",
        icon: Icons.instagram,
        navbar: true,
        footer: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/stevenmckinnon",
        icon: Icons.linkedin,
        navbar: true,
        footer: true,
      },
      X: {
        name: "X",
        url: "https://x.com/stevenmckinnon",
        icon: Icons.x,
        navbar: true,
        footer: true,
      },
      email: {
        name: "Email",
        url: "mailto:hello@stevenmckinnon.co.uk",
        icon: Icons.email,
        navbar: false,
        footer: true,
      },
      // Cross-link to the separate software-development portfolio. Kept out of
      // the main dock so the photography work stands on its own.
      GitHub: {
        name: "GitHub",
        url: "https://github.com/stevenmckinnon",
        icon: Icons.github,
        navbar: false,
        footer: false,
      },
      SoftwareDevResume: {
        name: "Software development portfolio",
        url: "https://stevemckinnon.co.uk",
        icon: Icons.computer,
        navbar: false,
        footer: true,
      },
    },
  },
} as const;

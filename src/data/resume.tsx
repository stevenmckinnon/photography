import { Icons } from "@/components/icons";
import type { Info } from "@/types/resume";
import { HomeIcon } from "lucide-react";

export const DATA: Info = {
  name: "Steve McKinnon",
  initials: "SM",
  url: "https://stevemckinnon.co.uk",
  description:
    "I'm a Glasgow based front end developer creating modern web apps.\nLet's start scrolling and learn more about me.",
  avatarUrl: "/me.jpg",
  navbar: [{ href: "/", icon: HomeIcon, label: "Home" }],
  contact: {
    email: "hello@stevenmckinnon.co.uk",
    tel: "+447753232305",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/stevenmckinnon",
        icon: Icons.github,
        navbar: true,
      },
      Instagram: {
        name: "Instagram",
        url: "https://instagram.com/stevenmckinnon",
        icon: Icons.instagram,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/stevenmckinnon",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/stevenmckinnon",
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:hello@stevenmckinnon.co.uk",
        icon: Icons.email,
        navbar: false,
      },
      SoftwareDevResume: {
        name: "Software Dev Resume",
        url: "https://stevemckinnon.co.uk",
        icon: Icons.computer,
        navbar: true,
      },
    },
  },
} as const;

import { IconProps } from "@/components/icons";

export type SocialLink = {
  name: string;
  url: string;
  icon: React.ComponentType<IconProps>; // Use React.ComponentType for icon components
  /** Show in the floating dock. */
  navbar?: boolean;
  /** Show in the site footer. */
  footer?: boolean;
};

export type Contact = {
  email: string;
  tel: string;
  social: {
    [key: string]: SocialLink; // Index signature for dynamic social media keys
  };
};

export type NavbarItem = {
  href: string;
  icon: React.ComponentType<IconProps>;
  label: string;
};

export type Info = {
  name: string;
  initials: string;
  url: string;
  /** Short professional descriptor, e.g. for image alt text. */
  role: string;
  location: string;
  /** Hero line shown on the homepage. */
  tagline: string;
  /** Meta description used for search results and social cards. */
  description: string;
  /** Absolute URL of the social share image. */
  ogImage: string;
  avatarUrl: string;
  navbar: NavbarItem[];
  contact: Contact;
};

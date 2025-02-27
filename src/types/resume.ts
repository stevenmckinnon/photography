import { IconProps } from "@/components/icons";

export type SocialLink = {
  name: string;
  url: string;
  icon: React.ComponentType<IconProps>; // Use React.ComponentType for icon components
  navbar?: boolean;
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
  description: string;
  avatarUrl: string;
  navbar: NavbarItem[];
  contact: Contact;
};

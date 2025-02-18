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

export type WorkExperience = {
  company: string;
  href: string;
  badges?: string[]; // Or a more specific badge type if needed
  location?: string;
  title: string;
  logoUrl: string;
  start: string;
  end?: string; // Optional end date
  description?: string;
  defaultExpanded?: boolean;
};

export type EducationItem = {
  school: string;
  href: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
  defaultExpanded: boolean;
};

export type ProjectLink = {
  type: string;
  href: string;
  icon: JSX.Element; // Use JSX.Element for the actual icon JSX
};

export type Resume = {
  name: string;
  initials: string;
  url: string;
  location: string;
  locationLink: string;
  description: string;
  summary: string;
  avatarUrl: string;
  skills: string[];
  navbar: NavbarItem[];
  contact: Contact;
  work: WorkExperience[];
  education: EducationItem[];
  otherWork: WorkExperience[];
};

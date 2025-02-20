import { Icons } from "@/components/icons";
import type { Resume } from "@/types/resume";
import { HomeIcon } from "lucide-react";

export const DATA: Resume = {
  name: "Steve McKinnon",
  initials: "SM",
  url: "https://stevemckinnon.co.uk",
  location: "Glasgow, Scotland",
  locationLink: "https://www.google.com/maps/place/glasgow",
  description:
    "I'm a Glasgow based front end developer creating modern web apps.\nLet's start scrolling and learn more about me.",
  avatarUrl: "/me.jpg",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Javascript",
    "HTML",
    "CSS/SCSS",
    "GraphQL",
  ],
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

  work: [
    {
      company: "JP Morgan Chase",
      href: "https://jpmorgan.com",
      badges: [],
      location: "Glasgow, Scotland",
      title: "Lead Frontend Developer",
      logoUrl: "/jpm.png",
      start: "February 2024",
      description: `As the lead developer, I manage a team of eight developers, overseeing the design
and implementation of robust UI libraries featuring reusable components, design
patterns, and business intelligence tools. I play a pivotal role in creating application
scaffolds that enable teams to rapidly set up new applications while adhering to
consistent patterns, streamlining the development process across the organisation.

In addition to my development responsibilities, I serve as one of the leads for the firm’s Risk Technology space, driving innovation and best practices in UI development. I am also actively engaged in managing client relationships, mentoring team members, and promoting "sensible defaults" to ensure scalable and efficient application development. 

My role combines technical expertise, strategic leadership, and a
commitment to fostering both individual and team growth.`,
    },
    {
      company: "&Open",
      badges: [],
      href: "https://andopen.co",
      location: "Remote",
      title: "Lead Frontend Developer",
      logoUrl: "/andopen.png",
      start: "March 2022",
      end: "February 2024",
      description: `Contributing to the development of a multi-tenant corporate gifting platform, I have
helped enable companies to seamlessly deliver tailored and curated gifts to
employees, clients, and other stakeholders. Employing React and TypeScript, I have
participated in crafting a responsive, accessible, and secure application through the
creation of a well-tested and documented custom component library, hooks, and
functions. The platform showcases a versatile gift recipient interface, and personalised emails that adapt to each client's branding, fostering trust among recipients and emphasising the gifts' origins. 

In close collaboration with management, product, and design teams, I consistently strive to surpass client needs and expectations. As a proactive team member, I have confidently led initiatives, mentored colleagues, and contributed to shaping the company's strategic direction.`,
    },
    {
      company: "Evotix",
      href: "https://evotix.com/",
      badges: [],
      location: "Remote",
      title: "Senior Software Engineer",
      logoUrl: "/evotix.png",
      start: "January 2021",
      end: "March 2022",
      description: `Worked on the next generation of the company’s health and safety application. Using React/TypeScript to build a responsive, modern and secure application. This involved building a component library to transform JSON into complex forms using a bespoke renderer, which can be used by the client to create custom forms, with strong considerations to accessibility, language and simplicity. Working alongside the product and UX teams to meet customer needs and expectations.`,
    },
    {
      company: "JP Morgan Chase",
      href: "https://jpmorgan.com",
      badges: [],
      location: "Glasgow, Scotland",
      title: "Senior Frontend Developer",
      logoUrl: "/jpm.png",
      start: "May 2019",
      end: "December 2020",
      description: `Building an Electron based desktop platform for Windows, which is used by multiple development teams and end users across the firm. Using Typescript, React and Redux and OpenFin to power the platform, which offers advanced layout capabilities, and client-side interoperability.`,
    },
    {
      company: "JP Morgan Chase",
      href: "https://jpmorgan.com",
      badges: [],
      location: "Glasgow, Scotland",
      title: "Frontend Developer",
      logoUrl: "/jpm.png",
      start: "June 2018",
      end: "May 2019",
      description: `Worked to build a modern and responsive GraphQL playground, and an aggregated company news application, with the end-user in mind. I also worked with the UX team to host usability sessions to determine end-user’s expectations and needs. Building React component library for other development teams in the firm to use. Training team members up on front end technologies.`,
    },
    {
      company: "JP Morgan Chase",
      href: "https://jpmorgan.com",
      badges: [],
      location: "Glasgow, Scotland",
      title: "Full Stack Developer",
      logoUrl: "/jpm.png",
      start: "November 2016",
      end: "June 2018",
      description: `Full stack developer with other responsibilities including: discussing business requirements with end users on a global scale, making design decisions for the project, handling deployments and maintaining stability of application environments, and working with, and managing Scrum and agile methodologies. Training new team members.`,
    },
    {
      company: "JP Morgan Chase",
      href: "https://jpmorgan.com",
      badges: [],
      location: "Glasgow, Scotland",
      title: "Frontend Developer / QA Engineer",
      logoUrl: "/jpm.png",
      start: "June 2014",
      end: "November 2016",
      description: `Key point of contact for designing — utilising wireframes and proof of concepts — and implementing the application front end to meet end user needs. 
      
Development of a comprehensive, automated end-to-end test suite. Leveraging the power of Selenium and embracing BDD principles.`,
    },
  ],
  education: [
    {
      school: "Glasgow Caledonian Univeristy",
      href: "https://www.gcu.ac.uk/",
      degree: "BSc (Honours)",
      logoUrl: "/gcu.png",
      start: "September 2010",
      end: "May 2014",
      defaultExpanded: false,
    },
  ],
  otherWork: [
    {
      company: "WWE",
      href: "https://wwe.com",
      title: "Camera Operator",
      logoUrl: "/wwe.png",
      start: "November 2021",
      defaultExpanded: false,
    },
    {
      company: "Insane Championship Wrestling",
      href: "https://www.insanewrestling.co.uk/",
      title: "Camera Operator",
      logoUrl: "/icw.png",
      start: "October 2020",
      defaultExpanded: false,
    },
    {
      company: "Steven McKinnon Photography",
      href: "https://stevenmckinnon.co.uk/",
      title: "Photographer",
      logoUrl: "/me.jpg",
      start: "January 2016",
      defaultExpanded: false,
    },
  ],
} as const;

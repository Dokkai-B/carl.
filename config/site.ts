export const siteConfig = {
  name: "Carl Patrick Adrian Aguas",
  title: "Carl Aguas - Full-Stack Developer & UI/UX Enthusiast",
  description:
    "Full-Stack Developer specializing in modern web applications with React, Next.js, and TypeScript. Creating performant, accessible, and user-focused digital experiences with cutting-edge technologies.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://carl-portfolio.vercel.app",
  ogImage: "/Logo/Logo.png",
  links: {
    github: "https://github.com/Dokkai-B",
    linkedin: "https://linkedin.com/in/carl-patrick-adrian-aguas-0a5959292",
    email: "xix.carlaguas.xix@gmail.com",
  },
  creator: "@carl_aguas",
  keywords: [
    "Full-Stack Developer",
    "Web Development",
    "React Developer",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Software Engineer",
    "Frontend Development",
    "Backend Development",
    "UI/UX Design",
    "Mobile-First Design",
    "Performance Optimization",
    "Carl Aguas",
    "Carl Patrick Aguas",
  ],
};

export type SiteConfig = typeof siteConfig;

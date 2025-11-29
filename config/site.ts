export const siteConfig = {
  name: "Carl Patrick Adrian Aguas",
  title: "Carl. - Full-Stack Developer Portfolio",
  description:
    "Aspiring Full-Stack Developer specializing in user-friendly digital solutions. Experienced in modern web technologies, frameworks, and programming languages.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://carl-portfolio.vercel.app",
  ogImage: "/assets/og-image.png",
  links: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
  },
  creator: "@yourusername",
  keywords: [
    "Full-Stack Developer",
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Software Engineer",
    "Frontend Development",
    "Backend Development",
  ],
};

export type SiteConfig = typeof siteConfig;

export interface NavLink {
  name: string;
  path: string;
}

export interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

export interface WorkItem {
  num: string;
  category: string;
  title: string;
  description: string;
  stack: { name: string }[];
  image: string;
  live: string;
  github: string;
}

export interface Service {
  num: string;
  title: string;
  description: string;
  href: string;
}

export interface Stat {
  num: number;
  text: string;
}

export interface ResumeData {
  icon: string;
  title: string;
  description: string;
  items: {
    company?: string;
    position?: string;
    duration?: string;
    institution?: string;
    degree?: string;
  }[];
}

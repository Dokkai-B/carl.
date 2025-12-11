// =============================================
// PROJECT DATA TYPES
// =============================================

export type ProjectType = "mobile-only" | "web-only" | "mobile-web";

export type IconName =
  | "Mic"
  | "Cloud"
  | "Music"
  | "Play"
  | "Shield"
  | "Zap"
  | "Radio"
  | "MapPin"
  | "Camera"
  | "Monitor"
  | "Heart"
  | "Map"
  | "Users"
  | "Clock"
  | "Lock"
  | "Bolt"
  | "Wifi"
  | "AlertCircle";

export interface ProjectScreen {
  name: string;
  image: string;
}

export interface ProjectColors {
  primary: string;
  secondary: string;
  light: {
    primary: string;
    secondary: string;
  };
}

export interface ProjectFeature {
  icon: IconName;
  text: string;
}

export interface ProjectLink {
  prototype?: string;
  github?: string;
  livesite?: string;
}

export interface ProjectNavigation {
  name: string;
  slug: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  year: string;
  role: string;
  type: ProjectType;
  summary: string;
  heroImage: string;
  links: ProjectLink;
  features: ProjectFeature[];
  techStack: string[];
  mobileScreens?: ProjectScreen[];
  webViews?: ProjectScreen[];
  colors: ProjectColors;
}

// =============================================
// PROJECTS DATA
// =============================================

export const projects: Project[] = [
  // Blue Ward - Full Stack (Mobile + Web)
  {
    id: 1,
    slug: "blueward",
    title: "Blue Ward",
    category: "Full-Stack Application",
    year: "2025",
    role: "",
    type: "mobile-web",
    summary:
      "A real-time emergency assistance platform designed for critical situations requiring immediate remote support. It enables secure live communication between responders and users through bidirectional messaging, geolocation tracking, remote media capture, and a cloud-deployed backend spanning mobile, web, and backend services with a fully integrated real-time architecture.",
    heroImage: "/Temp Projects Thumbnail/Blue Ward.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      {
        icon: "Radio",
        text: "Live WebSocket-powered bidirectional messaging between mobile users and web dashboard",
      },
      {
        icon: "Camera",
        text: "Remote camera and audio capture for visual and auditory context gathering",
      },
      {
        icon: "MapPin",
        text: "Continuous geolocation tracking with background services and GPS updates",
      },
      { icon: "Shield", text: "Cloud media storage using AWS S3 with secure pre-signed URLs" },
      {
        icon: "Monitor",
        text: "Agent dashboard for monitoring active sessions, viewing media, and sending commands",
      },
      {
        icon: "Zap",
        text: "JWT authentication with bcrypt hashing, Helmet.js, CORS, and rate limiting",
      },
    ],
    techStack: [
      "Node.js",
      "Express.js",
      "Socket.IO",
      "React.js",
      "Flutter",
      "AWS S3",
      "Docker",
      "Material-UI",
      "Provider",
      "JWT",
      "Render",
      "Vercel",
    ],
    mobileScreens: [
      { name: "Status", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Status_Dark.png" },
      { name: "GPS", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/GPS_Dark.png" },
      { name: "Camera", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Camera_Dark.png" },
      { name: "Audio", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Audio_Dark.png" },
      { name: "Battery", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Battery_Dark.png" },
    ],
    webViews: [
      // Add Blue Ward web screenshots here
      { name: "Dashboard", image: "/Temp Projects UI/Blue Ward/Web/Dashboard.png" },
      { name: "Agent Panel", image: "/Temp Projects UI/Blue Ward/Web/Agent.png" },
    ],
    colors: {
      primary: "#96c8ec",
      secondary: "#419cb9",
      light: {
        primary: "#96c8ec",
        secondary: "#419cb9",
      },
    },
  },

  // Moonii - Mobile Only
  {
    id: 5,
    slug: "moonii",
    title: "Moonii",
    category: "Mobile Application",
    year: "2025",
    role: "",
    type: "mobile-only",
    summary:
      "A cross-platform mobile application for recording, storing, and playing personalized bedtime stories. It enables parents to capture audio narrations that are securely uploaded to the cloud and accessed by family members through a modern, synchronized audio player interface.",
    heroImage: "/Temp Projects Thumbnail/Moonii.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      {
        icon: "Mic",
        text: "Record personalized audio stories with mobile-native microphone access",
      },
      {
        icon: "Cloud",
        text: "Upload and store audio files securely using AWS S3 with pre-signed URLs",
      },
      {
        icon: "Music",
        text: "High-quality AAC-LC encoded M4A audio format for optimized playback",
      },
      {
        icon: "Play",
        text: "Modern audio player with waveform visualization and timeline controls",
      },
      { icon: "Shield", text: "Playlist management and multi-view synchronized playback state" },
      {
        icon: "Zap",
        text: "Error handling for failed uploads, network issues, and corrupted audio",
      },
    ],
    techStack: [
      "Flutter",
      "Node.js",
      "AWS S3",
      "Audio Processing",
      "Waveform UI",
      "Express",
      "Dart",
      "just_audio",
    ],
    mobileScreens: [
      { name: "Home", image: "/Temp Projects UI/Moonii/Phone Screenshots/1.png" },
      { name: "Story List", image: "/Temp Projects UI/Moonii/Phone Screenshots/2.png" },
      { name: "Recording", image: "/Temp Projects UI/Moonii/Phone Screenshots/3.png" },
      { name: "Recording Process", image: "/Temp Projects UI/Moonii/Phone Screenshots/4.png" },
      { name: "Upload", image: "/Temp Projects UI/Moonii/Phone Screenshots/5.png" },
    ],
    colors: {
      primary: "#957ab6",
      secondary: "#7c5fa3",
      light: {
        primary: "#b399cc",
        secondary: "#957ab6",
      },
    },
  },

  // SaveEat - Mobile Only (Placeholder)
  {
    id: 2,
    slug: "saveeat",
    title: "SaveEat",
    category: "Mobile Application",
    year: "2024",
    role: "",
    type: "mobile-only",
    summary: "A mobile application to reduce food waste by connecting users with surplus food.",
    heroImage: "/Temp Projects Thumbnail/SaveEat.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      { icon: "Heart", text: "Browse nearby surplus food listings" },
      { icon: "MapPin", text: "Real-time location-based food discovery" },
      { icon: "Clock", text: "Time-sensitive food listings" },
      { icon: "Shield", text: "Secure user verification system" },
      { icon: "Users", text: "Community ratings and reviews" },
      { icon: "Zap", text: "Instant notification system" },
    ],
    techStack: ["Flutter", "Firebase", "Google Maps", "Dart"],
    mobileScreens: [
      { name: "Home", image: "/Temp Projects UI/SaveEat/1.png" },
      { name: "Listings", image: "/Temp Projects UI/SaveEat/2.png" },
      { name: "Details", image: "/Temp Projects UI/SaveEat/3.png" },
    ],
    colors: {
      primary: "#16a34a",
      secondary: "#15803d",
      light: {
        primary: "#4ade80",
        secondary: "#22c55e",
      },
    },
  },

  // Heart to Art - Mobile Only (Placeholder)
  {
    id: 3,
    slug: "heart-to-art",
    title: "Heart to Art",
    category: "Mobile Application",
    year: "2024",
    role: "",
    type: "mobile-only",
    summary: "A creative mobile application for digital art creation and sharing.",
    heroImage: "/Temp Projects Thumbnail/Heart to Art.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      { icon: "Music", text: "Digital drawing and painting tools" },
      { icon: "Cloud", text: "Cloud-based artwork storage" },
      { icon: "Users", text: "Community sharing platform" },
      { icon: "Zap", text: "Real-time collaboration features" },
      { icon: "Shield", text: "Artwork protection and licensing" },
      { icon: "Heart", text: "Inspiration and discovery feed" },
    ],
    techStack: ["Flutter", "Canvas API", "Firebase", "Dart"],
    mobileScreens: [
      { name: "Canvas", image: "/Temp Projects UI/Heart to Art/1.png" },
      { name: "Gallery", image: "/Temp Projects UI/Heart to Art/2.png" },
      { name: "Share", image: "/Temp Projects UI/Heart to Art/3.png" },
    ],
    colors: {
      primary: "#ec4899",
      secondary: "#db2777",
      light: {
        primary: "#f472b6",
        secondary: "#f91e63",
      },
    },
  },

  // LostPaws - Web Only (Placeholder)
  {
    id: 4,
    slug: "lostpaws",
    title: "LostPaws",
    category: "Web Platform",
    year: "2024",
    role: "",
    type: "web-only",
    summary: "A web platform to help reunite lost pets with their owners.",
    heroImage: "/Temp Projects Thumbnail/LostPaws.png",
    links: {
      prototype: "#",
      github: "#",
      livesite: "#",
    },
    features: [
      { icon: "MapPin", text: "Interactive map for lost pet sightings" },
      { icon: "Camera", text: "Photo upload and identification" },
      { icon: "Users", text: "Community notifications and alerts" },
      { icon: "Clock", text: "Real-time updates on pet status" },
      { icon: "Shield", text: "Verified shelter partnerships" },
      { icon: "Zap", text: "Instant posting to social media" },
    ],
    techStack: ["React.js", "Node.js", "MongoDB", "Google Maps API", "Vercel"],
    webViews: [
      { name: "Dashboard", image: "/Temp Projects UI/LostPaws/Dashboard.png" },
      { name: "Map View", image: "/Temp Projects UI/LostPaws/Map.png" },
      { name: "Pet Details", image: "/Temp Projects UI/LostPaws/Details.png" },
    ],
    colors: {
      primary: "#f97316",
      secondary: "#ea580c",
      light: {
        primary: "#fb923c",
        secondary: "#fdba74",
      },
    },
  },

  // Earthshaker - Mobile Only (Placeholder)
  {
    id: 6,
    slug: "earthshaker",
    title: "Earthshaker",
    category: "Mobile Application",
    year: "2024",
    role: "",
    type: "mobile-only",
    summary: "A seismic monitoring and earthquake awareness mobile application.",
    heroImage: "/Temp Projects Thumbnail/Earthshaker.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      { icon: "AlertCircle", text: "Real-time earthquake detection and alerts" },
      { icon: "MapPin", text: "Seismic activity mapping and visualization" },
      { icon: "Wifi", text: "Offline-first earthquake preparation guides" },
      { icon: "Shield", text: "Personalized safety recommendations" },
      { icon: "Users", text: "Community earthquake reporting" },
      { icon: "Zap", text: "Multi-language support" },
    ],
    techStack: ["Flutter", "OpenStreetMap", "Firebase", "Dart"],
    mobileScreens: [
      { name: "Dashboard", image: "/Temp Projects UI/Earthshaker/1.png" },
      { name: "Map", image: "/Temp Projects UI/Earthshaker/2.png" },
      { name: "Alerts", image: "/Temp Projects UI/Earthshaker/3.png" },
    ],
    colors: {
      primary: "#dc2626",
      secondary: "#991b1b",
      light: {
        primary: "#ef4444",
        secondary: "#fca5a5",
      },
    },
  },

  // Women's Club - Web Only (Placeholder)
  {
    id: 7,
    slug: "womens-club",
    title: "Women's Club",
    category: "Web Platform",
    year: "2024",
    role: "",
    type: "web-only",
    summary: "A community platform for women to connect, share, and support each other.",
    heroImage: "/Temp Projects Thumbnail/Womens Club.png",
    links: {
      prototype: "#",
      github: "#",
      livesite: "#",
    },
    features: [
      { icon: "Users", text: "Community forums and discussion boards" },
      { icon: "Heart", text: "Mentorship matching system" },
      { icon: "Music", text: "Event scheduling and coordination" },
      { icon: "Shield", text: "Safe and moderated community spaces" },
      { icon: "Cloud", text: "Resource library and knowledge base" },
      { icon: "Zap", text: "Real-time notifications and updates" },
    ],
    techStack: ["React.js", "Node.js", "PostgreSQL", "Socket.IO", "Vercel"],
    webViews: [
      { name: "Community", image: "/Temp Projects UI/Womens Club/Community.png" },
      { name: "Mentorship", image: "/Temp Projects UI/Womens Club/Mentorship.png" },
      { name: "Events", image: "/Temp Projects UI/Womens Club/Events.png" },
    ],
    colors: {
      primary: "#d946ef",
      secondary: "#c026d3",
      light: {
        primary: "#e879f9",
        secondary: "#f0abfc",
      },
    },
  },
];

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Find a project by slug
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Get navigation info for a project (previous and next)
 */
export function getProjectNavigation(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

/**
 * Get all project slugs for static generation
 */
export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

/**
 * Check if a project has mobile screens
 */
export function hasModuleMobileScreens(project: Project): boolean {
  return project.type === "mobile-only" || project.type === "mobile-web";
}

/**
 * Check if a project has web views
 */
export function hasWebViews(project: Project): boolean {
  return project.type === "web-only" || project.type === "mobile-web";
}

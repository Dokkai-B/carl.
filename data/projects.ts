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
      "Blue Ward is a real-time emergency assistance platform enabling secure remote monitoring and response during critical situations. The system integrates mobile, backend, and web dashboard components with live bidirectional communication.",
    heroImage: "/Temp Photos/HeroPhoto/BlueWard.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      {
        icon: "Radio",
        text: "Real-time bidirectional messaging using WebSockets",
      },
      {
        icon: "MapPin",
        text: "Live geolocation tracking",
      },
      {
        icon: "Camera",
        text: "Remote camera and audio capture",
      },
      { icon: "Cloud", text: "Cloud media storage" },
      {
        icon: "Monitor",
        text: "Web-based responder dashboard",
      },
      {
        icon: "Shield",
        text: "Secure authentication and access control",
      },
    ],
    techStack: [
      "Node.js",
      "Express",
      "Socket.IO",
      "JWT",
      "AWS S3",
      "Flutter",
      "React",
      "Material UI",
      "Docker",
      "Render",
      "Vercel",
    ],
    mobileScreens: [
      {
        name: "GPS Tracking",
        image: "/Temp Photos/UIPhoto/BlueWard/Mobile/Dark/GPSTracking_MobileLeft.png",
      },
      {
        name: "Status Overview",
        image: "/Temp Photos/UIPhoto/BlueWard/Mobile/Dark/StatusOverview_MobileCenter.png",
      },
      {
        name: "Camera Status",
        image: "/Temp Photos/UIPhoto/BlueWard/Mobile/Dark/CameraStatus_MobileRight.png",
      },
      {
        name: "Audio Recording",
        image: "/Temp Photos/UIPhoto/BlueWard/Mobile/Dark/AudioRecording.png",
      },
    ],
    webViews: [
      {
        name: "Dashboard",
        image: "/Temp Photos/UIPhoto/BlueWard/Desktop/Dashboard_DesktopLeft.png",
      },
      { name: "Login", image: "/Temp Photos/UIPhoto/BlueWard/Desktop/Login_DesktopRight.png" },
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
      "Moonii is a cross-platform mobile application for recording, storing, and playing personalized bedtime stories. Parents can record audio narrations that are securely uploaded to the cloud and accessed by family members through a synchronized, modern audio player interface.",
    heroImage: "/Temp Photos/HeroPhoto/Moonii.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      {
        icon: "Mic",
        text: "Audio recording using native mobile microphone access",
      },
      {
        icon: "Cloud",
        text: "Secure audio upload and storage in the cloud",
      },
      {
        icon: "Music",
        text: "High-quality AAC-LC encoded M4A playback",
      },
      {
        icon: "Play",
        text: "Waveform visualization and timeline controls",
      },
      { icon: "Shield", text: "Playlist management" },
      {
        icon: "Zap",
        text: "Robust error handling for network and audio failures",
      },
    ],
    techStack: [
      "Flutter",
      "Dart",
      "just_audio",
      "audio_waveforms",
      "record",
      "Node.js",
      "Express",
      "AWS S3",
      "Render",
    ],
    mobileScreens: [
      {
        name: "Audio Recording",
        image: "/Temp Photos/UIPhoto/Moonii/AudioRecording_MobileLeft.png",
      },
      { name: "Home", image: "/Temp Photos/UIPhoto/Moonii/Home_MobileCenter.png" },
      { name: "Audio Upload", image: "/Temp Photos/UIPhoto/Moonii/AudioUpload_MobileRight.png" },
      { name: "Audio Record", image: "/Temp Photos/UIPhoto/Moonii/AudioRecord.png" },
      { name: "Story List", image: "/Temp Photos/UIPhoto/Moonii/StoryList.png" },
    ],
    colors: {
      primary: "#a77bbe",
      secondary: "#607ac2",
      light: {
        primary: "#d4b5e5",
        secondary: "#9fa3d9",
      },
    },
  },

  // SaveEat - Mobile Only
  {
    id: 6,
    slug: "saveeat",
    title: "SaveEat",
    category: "Mobile Application",
    year: "2024",
    role: "",
    type: "mobile-only",
    summary:
      "SaveEat is a mobile application that integrates nutrition tracking with personal budget management to help users make informed dietary and financial decisions.",
    heroImage: "/Temp Photos/HeroPhoto/SaveEat.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      { icon: "Users", text: "Account creation and login with budget setup" },
      { icon: "Shield", text: "Budget tracking with balance updates" },
      { icon: "Heart", text: "Macro tracking for calories, fat, protein, and carbs" },
      { icon: "Clock", text: "Income and expense recording (food and non-food)" },
      { icon: "Music", text: "Food intake tracking independent of expenses" },
      { icon: "Zap", text: "Food search and nutritional analysis via Edamam API" },
    ],
    techStack: ["Flutter", "Dart", "Edamam Food Database API"],
    mobileScreens: [
      { name: "Macros", image: "/Temp Photos/UIPhoto/SaveEat/Macros_MobileLeft.png" },
      { name: "Logo", image: "/Temp Photos/UIPhoto/SaveEat/Logo_MobileCenter.png" },
      { name: "Budget", image: "/Temp Photos/UIPhoto/SaveEat/Budget_MobileRight.png" },
      { name: "Account Details", image: "/Temp Photos/UIPhoto/SaveEat/AccountDetails.png" },
      { name: "Create Account", image: "/Temp Photos/UIPhoto/SaveEat/CreateAccount.png" },
      { name: "Current Balance", image: "/Temp Photos/UIPhoto/SaveEat/CurrentBalance.png" },
      { name: "Login", image: "/Temp Photos/UIPhoto/SaveEat/Login.png" },
    ],
    colors: {
      primary: "#fd8f4c",
      secondary: "#eef0ed",
      light: {
        primary: "#ffb088",
        secondary: "#fff5f0",
      },
    },
  },

  // Heart to Art - Mobile Only
  {
    id: 3,
    slug: "heart-to-art",
    title: "Heart to Art",
    category: "Mobile Application",
    year: "2024",
    role: "",
    type: "mobile-only",
    summary:
      "Heart to Art is a mobile application designed to connect artists and clients through an open request and direct commission system. It enables artists to find work and clients to commission artwork within a secure, in-app environment.",
    heroImage: "/Temp Photos/HeroPhoto/HeartToArt.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      { icon: "Users", text: "Client and Artist account types with secure registration" },
      { icon: "MapPin", text: "Open art requests that become unavailable once claimed" },
      { icon: "Camera", text: "Direct commissioning through artist search and messaging" },
      { icon: "Music", text: "Public artist profiles with portfolio and price tiers" },
      { icon: "Shield", text: "Secure in-app messaging" },
      { icon: "Heart", text: "Payment release and client rating system" },
    ],
    techStack: [
      "React Native",
      "JavaScript",
      "Expo",
      "Firebase Authentication",
      "Firestore",
      "Firebase Storage",
    ],
    mobileScreens: [
      { name: "Chatting", image: "/Temp Photos/UIPhoto/HeartToArt/Chatting_MobileLeft.png" },
      { name: "Logo", image: "/Temp Photos/UIPhoto/HeartToArt/Logo_MobileCenter.png" },
      {
        name: "Transaction Details",
        image: "/Temp Photos/UIPhoto/HeartToArt/TransactionDetails_MobileRight.png",
      },
      { name: "Artist Account", image: "/Temp Photos/UIPhoto/HeartToArt/ArtistAccount.png" },
      { name: "Artist Rating", image: "/Temp Photos/UIPhoto/HeartToArt/ArtistRating.png" },
      { name: "Chat List", image: "/Temp Photos/UIPhoto/HeartToArt/ChatList.png" },
      { name: "Edit Profile", image: "/Temp Photos/UIPhoto/HeartToArt/EditProfile.png" },
      {
        name: "Request Confirmation",
        image: "/Temp Photos/UIPhoto/HeartToArt/RequestConfirmation.png",
      },
      { name: "Request List", image: "/Temp Photos/UIPhoto/HeartToArt/RequestList.png" },
      { name: "User Feed", image: "/Temp Photos/UIPhoto/HeartToArt/UserFeed.png" },
    ],
    colors: {
      primary: "#b20018",
      secondary: "#d8d8d8",
      light: {
        primary: "#e63946",
        secondary: "#f5f5f5",
      },
    },
  },

  // LostPaws - Web Only
  {
    id: 4,
    slug: "lostpaws",
    title: "LostPaws",
    category: "Web Platform",
    year: "2024",
    role: "",
    type: "web-only",
    summary:
      "LostPaws is a mobile web application designed to help locate, adopt, and rehome lost pets by improving the exposure of pets and animal welfare organizations.",
    heroImage: "/Temp Photos/HeroPhoto/LostPaws.png",
    links: {
      prototype: "#",
      github: "#",
      livesite: "#",
    },
    features: [
      { icon: "Users", text: "User authentication" },
      { icon: "MapPin", text: "Listings for lost and adoptable pets" },
      { icon: "Shield", text: "Organization profiles for animal welfare groups" },
      { icon: "Heart", text: "Centralized discovery platform for pets and services" },
      { icon: "Cloud", text: "CRUD-based web application" },
      { icon: "Lock", text: "Relational database design" },
    ],
    techStack: ["HTML", "CSS", "SQL", "Figma"],
    webViews: [
      { name: "Home", image: "/Temp Photos/UIPhoto/LostPaws/Home_DesktopLeft.png" },
      { name: "Logo", image: "/Temp Photos/UIPhoto/LostPaws/Logo_DesktopCenter.png" },
      { name: "Login", image: "/Temp Photos/UIPhoto/LostPaws/Login_DesktopRight.png" },
      { name: "Adoption", image: "/Temp Photos/UIPhoto/LostPaws/Adoption.png" },
      { name: "Found Pets", image: "/Temp Photos/UIPhoto/LostPaws/FoundPets.png" },
      { name: "Lost Pets", image: "/Temp Photos/UIPhoto/LostPaws/LostPets.png" },
    ],
    colors: {
      primary: "#18b24f",
      secondary: "#ffffff",
      light: {
        primary: "#4ade80",
        secondary: "#f5f5f5",
      },
    },
  },

  // Earthshaker - Mobile Only
  {
    id: 6,
    slug: "earthshaker",
    title: "Earthshaker",
    category: "Mobile Application",
    year: "2024",
    role: "",
    type: "mobile-only",
    summary:
      "Earthshaker is a real-time earthquake alert system for the Philippines that monitors seismic activity and delivers instant push notifications to users. The system prioritizes speed, reliability, and battery efficiency.",
    heroImage: "/Temp Photos/HeroPhoto/Earthshaker.png",
    links: {
      prototype: "#",
      github: "#",
    },
    features: [
      { icon: "AlertCircle", text: "Real-time earthquake monitoring via USGS API" },
      { icon: "Zap", text: "Push notifications with sub-second delivery" },
      { icon: "Wifi", text: "Topic-based notification architecture" },
      { icon: "Shield", text: "Duplicate event filtering and in-memory caching" },
      { icon: "MapPin", text: "Location-based alerting within configurable radius" },
      { icon: "Cloud", text: "Offline-safe local persistence" },
    ],
    techStack: [
      "Flutter",
      "Dart",
      "Node.js",
      "Express",
      "Firebase Cloud Messaging",
      "Firebase Admin SDK",
      "USGS Earthquake API",
      "Render",
    ],
    mobileScreens: [
      { name: "Settings", image: "/Temp Photos/UIPhoto/Earthshaker/Settings_MobileLeft.png" },
      { name: "Dashboard", image: "/Temp Photos/UIPhoto/Earthshaker/Dashboard_MobileCenter.png" },
      {
        name: "More Settings",
        image: "/Temp Photos/UIPhoto/Earthshaker/More Settings_MobileRight.png",
      },
    ],
    colors: {
      primary: "#c7c6c6",
      secondary: "#aa352c",
      light: {
        primary: "#e0dfdf",
        secondary: "#d97b71",
      },
    },
  },

  // Women's Club - Web Only
  {
    id: 7,
    slug: "womens-club",
    title: "Womens CLUB",
    category: "Web Platform",
    year: "2024",
    role: "",
    type: "web-only",
    summary:
      "Womens Club is a web-based management system developed for a volunteer-driven non-government organization in Womens Club, Quezon City. The platform modernizes their traditional website and supports transparent management of members, events, and donations.",
    heroImage: "/Temp Photos/HeroPhoto/WomensCLUB.png",
    links: {
      prototype: "#",
      github: "#",
      livesite: "#",
    },
    features: [
      {
        icon: "Users",
        text: "Member registration, authentication, and directory with admin approval",
      },
      { icon: "Clock", text: "Event creation, modification, deletion, and volunteer registration" },
      { icon: "Heart", text: "Donation recording, tracking, and history logs" },
      { icon: "Shield", text: "Desktop-only website with restricted member and admin access" },
      { icon: "Lock", text: "No online payment or social media integration" },
      { icon: "Music", text: "Aligned with UN SDGs for social impact" },
    ],
    techStack: ["HTML", "CSS", "JavaScript", "PHP", "Laravel", "MySQL"],
    webViews: [
      { name: "Login Page", image: "/Temp Photos/UIPhoto/WomensCLUB/LoginPage_DesktopLeft.png" },
      { name: "Home", image: "/Temp Photos/UIPhoto/WomensCLUB/Home_DesktopCenter.png" },
      { name: "Event LIst", image: "/Temp Photos/UIPhoto/WomensCLUB/EventLIst_DesktopRight.png" },
      { name: "404 Page", image: "/Temp Photos/UIPhoto/WomensCLUB/404Page.png" },
      { name: "Create Event", image: "/Temp Photos/UIPhoto/WomensCLUB/CreateEvent.png" },
      { name: "Edit User", image: "/Temp Photos/UIPhoto/WomensCLUB/EditUser.png" },
      { name: "Event Details", image: "/Temp Photos/UIPhoto/WomensCLUB/EventDetails.png" },
      {
        name: "Event Participation",
        image: "/Temp Photos/UIPhoto/WomensCLUB/EventParticipation.png",
      },
      { name: "Member List", image: "/Temp Photos/UIPhoto/WomensCLUB/MemberList.png" },
    ],
    colors: {
      primary: "#232289",
      secondary: "#ffffff",
      light: {
        primary: "#4f46e5",
        secondary: "#f5f5f5",
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

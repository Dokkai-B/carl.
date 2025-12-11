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
    heroImage: "/Temp Photos/HeroPhoto/BlueWard.png",
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
      "A cross-platform mobile application for recording, storing, and playing personalized bedtime stories. It enables parents to capture audio narrations that are securely uploaded to the cloud and accessed by family members through a modern, synchronized audio player interface.",
    heroImage: "/Temp Photos/HeroPhoto/Moonii.png",
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
    heroImage: "/Temp Photos/HeroPhoto/SaveEat.png",
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
      { name: "Macros", image: "/Temp Photos/UIPhoto/SaveEat/Macros_MobileLeft.png" },
      { name: "Logo", image: "/Temp Photos/UIPhoto/SaveEat/Logo_MobileCenter.png" },
      { name: "Budget", image: "/Temp Photos/UIPhoto/SaveEat/Budget_MobileRight.png" },
      { name: "Account Details", image: "/Temp Photos/UIPhoto/SaveEat/AccountDetails.png" },
      { name: "Create Account", image: "/Temp Photos/UIPhoto/SaveEat/CreateAccount.png" },
      { name: "Current Balance", image: "/Temp Photos/UIPhoto/SaveEat/CurrentBalance.png" },
      { name: "Login", image: "/Temp Photos/UIPhoto/SaveEat/Login.png" },
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
    heroImage: "/Temp Photos/HeroPhoto/HeartToArt.png",
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
    heroImage: "/Temp Photos/HeroPhoto/LostPaws.png",
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
      { name: "Home", image: "/Temp Photos/UIPhoto/LostPaws/Home_DesktopLeft.png" },
      { name: "Logo", image: "/Temp Photos/UIPhoto/LostPaws/Logo_DesktopCenter.png" },
      { name: "Login", image: "/Temp Photos/UIPhoto/LostPaws/Login_DesktopRight.png" },
      { name: "Adoption", image: "/Temp Photos/UIPhoto/LostPaws/Adoption.png" },
      { name: "Found Pets", image: "/Temp Photos/UIPhoto/LostPaws/FoundPets.png" },
      { name: "Lost Pets", image: "/Temp Photos/UIPhoto/LostPaws/LostPets.png" },
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
    heroImage: "/Temp Photos/HeroPhoto/Earthshaker.png",
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
      { name: "Settings", image: "/Temp Photos/UIPhoto/Earthshaker/Settings_MobileLeft.png" },
      { name: "Dashboard", image: "/Temp Photos/UIPhoto/Earthshaker/Dashboard_MobileCenter.png" },
      {
        name: "More Settings",
        image: "/Temp Photos/UIPhoto/Earthshaker/More Settings_MobileRight.png",
      },
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
    title: "Womens CLUB",
    category: "Web Platform",
    year: "2024",
    role: "",
    type: "web-only",
    summary: "A community platform for women to connect, share, and support each other.",
    heroImage: "/Temp Photos/HeroPhoto/WomensCLUB.png",
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

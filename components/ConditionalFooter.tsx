"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on home page or work project pages
  if (pathname === "/" || pathname.startsWith("/work/")) {
    return null;
  }

  return <Footer />;
}

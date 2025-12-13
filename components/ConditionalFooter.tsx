"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on home page, work project pages, contact page, or resume page
  if (pathname === "/" || pathname.startsWith("/work/") || pathname === "/contact" || pathname === "/resume") {
    return null;
  }

  return <Footer />;
}

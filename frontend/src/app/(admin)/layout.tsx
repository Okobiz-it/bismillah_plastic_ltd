import type { Metadata } from "next";
import "../globals.css";

import { IMAGES } from "@/constants/images";

export const metadata: Metadata = {
  title: "Admin Panel | Bismillah Plastic",
  description: "CMS for Bismillah Plastic",
  icons: {
    icon: IMAGES.FAVICON,
    shortcut: IMAGES.FAVICON,
    apple: IMAGES.FAVICON,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-stone-light font-sans">
      {children}
    </div>
  );
}

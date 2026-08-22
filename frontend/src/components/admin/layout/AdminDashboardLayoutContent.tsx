"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { ToastProvider } from "@/context/ToastContext";
import { getAuthToken } from "@/lib/api";

export default function AdminDashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/admin/login");
    } else {
      setIsAuthorized(true);
    }

    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved) {
      setIsCollapsed(saved === "true");
    }
  }, [router]);

  // Close drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen]);

  const openMobileDrawer = useCallback(() => setIsMobileDrawerOpen(true), []);
  const closeMobileDrawer = useCallback(() => setIsMobileDrawerOpen(false), []);

  if (!isAuthorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-light text-stone-500 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <ToastProvider>
      <div className="flex h-screen bg-stone-light overflow-hidden admin-root">
        {/* Desktop Sidebar — hidden on mobile */}
        <div className="hidden lg:block">
          <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        </div>

        {/* Mobile Drawer Sidebar */}
        <div className="lg:hidden">
          <AdminSidebar
            isMobileOpen={isMobileDrawerOpen}
            onMobileClose={closeMobileDrawer}
          />
        </div>

        {/* Main content area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            // Desktop: offset by sidebar width
            isCollapsed ? "lg:ml-[80px]" : "lg:ml-64"
          }`}
        >
          <AdminTopbar onMenuClick={openMobileDrawer} />
          <main className="flex-1 p-4 sm:p-5 md:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { IMAGES } from "@/constants/images";
import {
  FaChartPie,
  FaBoxOpen,
  FaComments,
  FaEnvelope,
  FaInfoCircle,
  FaConciergeBell,
  FaGlobeAmericas,
  FaPhoneAlt,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaCog,
  FaImages,
  FaCheckCircle,
  FaIndustry,
  FaLeaf,
  FaShip
} from "react-icons/fa";

type NavItem = {
  label: string;
  href?: string;
  icon: any;
  subItems?: { label: string; href: string; icon?: any }[];
};

const navItems: NavItem[] = [
  {
    label: "About",
    icon: FaInfoCircle,
    subItems: [
      { label: "Mission, Vision & History", href: "/admin/about/mission-vision" },
      { label: "Management", href: "/admin/about/management" },
      { label: "Photos | Videos", href: "/admin/about/gallery" },
    ]
  },
  { label: "Products", href: "/admin/products", icon: FaBoxOpen },
  { label: "Raw Materials", href: "/admin/raw-materials", icon: FaLeaf },
  { label: "Impact", href: "/admin/export", icon: FaGlobeAmericas },
  { label: "Testimonials", href: "/admin/testimonials", icon: FaComments },
  { label: "Quote Requests", href: "/admin/inquiries", icon: FaEnvelope },
];

type NavGroupProps = {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
  onLinkClick?: () => void;
};

function NavGroup({ item, pathname, isCollapsed, onLinkClick }: NavGroupProps) {
  const isParentActive = item.subItems?.some(sub => pathname === sub.href || pathname.startsWith(sub.href + "/"));
  const [isOpen, setIsOpen] = useState(isParentActive);

  if (isCollapsed) {
    return (
      <div className="relative group flex justify-center w-full my-0.5">
        <button
          type="button"
          className={`w-[40px] h-[40px] flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer ${isParentActive
            ? "bg-white/15 text-gold shadow-sm ring-1 ring-white/10"
            : "hover:bg-white/10 text-white/70 hover:text-white"
            }`}
          aria-label={item.label}
        >
          <item.icon className={`w-3.5 h-3.5 shrink-0 ${isParentActive ? "text-gold" : "text-white/60 group-hover:text-white"}`} />
        </button>

        {/* Collapsed Hover Flyout Menu */}
        {item.subItems && (
          <div className="absolute left-[calc(100%+10px)] top-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-[#0B2942] w-52 shadow-2xl rounded-md py-2 z-[70] transition-all duration-200 border border-white/15 -translate-x-2 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto">
            <div className="px-4 py-1.5 text-[11px] uppercase font-semibold tracking-wider text-gold border-b border-white/10 mb-1 flex items-center gap-2">
              <item.icon className="w-3 h-3 text-gold shrink-0" />
              <span>{item.label}</span>
            </div>
            <div className="py-1">
              {item.subItems.map(sub => {
                const isActive = pathname === sub.href;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={onLinkClick}
                    className={`block px-4 py-2 text-[12px] transition-colors cursor-pointer min-h-[36px] flex items-center ${isActive
                      ? "bg-white/15 text-gold font-medium"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-1 relative group">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${isParentActive ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/80 hover:text-white"
          }`}
      >
        <div className="flex items-center gap-3">
          <item.icon className={`w-3.5 h-3.5 shrink-0 ${isParentActive ? "text-gold" : "text-white/60"}`} />
          <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
        </div>
        {isOpen ? (
          <FaChevronDown className="w-2.5 h-2.5 text-white/40 shrink-0" />
        ) : (
          <FaChevronRight className="w-2.5 h-2.5 text-white/40 shrink-0" />
        )}
      </button>

      {/* Expanded Inline Menu */}
      {isOpen && (
        <div className="ml-4 pl-2.5 border-l border-white/15 mt-1 space-y-1">
          {item.subItems?.map(sub => {
            const isActive = pathname === sub.href;
            return (
              <Link
                key={sub.href}
                href={sub.href}
                onClick={onLinkClick}
                className={`flex items-center gap-2 px-2.5 py-2 text-[12px] rounded-md transition-colors cursor-pointer min-h-[36px] ${isActive
                  ? "bg-white/10 text-gold font-medium"
                  : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isActive ? "bg-gold" : "bg-white/30"}`} />
                <span className="leading-tight">{sub.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

type AdminSidebarProps = {
  // Desktop props
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
  // Mobile drawer props
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function AdminSidebar({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const isMobileMode = isMobileOpen !== undefined;

  // Swipe-to-close gesture support
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Swipe left > 60px (more horizontal than vertical) → close drawer
    if (deltaX < -60 && deltaY < 80 && onMobileClose) {
      onMobileClose();
    }
  }, [onMobileClose]);

  if (isMobileMode) {
    // Mobile drawer rendering
    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[59] transition-opacity duration-300 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          onClick={onMobileClose}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-brand flex flex-col text-white/80 z-[60] shadow-2xl transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Drawer Header */}
          <div className="h-14 flex items-center justify-between px-5 border-b border-white/10 shrink-0 bg-[#0B2942]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 relative flex items-center justify-center shrink-0">
                <Image
                  src={IMAGES.MAPLE_LOGO}
                  alt="Logo"
                  fill
                  sizes="28px"
                  quality={100}
                  className="object-contain drop-shadow-md brightness-0 invert"
                />
              </div>
              <span className="text-sm font-semibold text-white/90 tracking-wide">Admin Panel</span>
            </div>
            <button
              onClick={onMobileClose}
              className="w-7 h-7 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close navigation"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <div className="flex-1 overflow-y-auto py-4 min-h-0">
            <nav className="space-y-1 px-3 pb-6">
              {navItems.map((item) => {
                if (item.subItems) {
                  return (
                    <NavGroup
                      key={item.label}
                      item={item}
                      pathname={pathname}
                      isCollapsed={false}
                      onLinkClick={onMobileClose}
                    />
                  );
                }
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href!);
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer mb-1 min-h-[44px] ${isActive
                      ? "bg-white/10 text-gold font-medium"
                      : "hover:bg-white/5 hover:text-white text-white/80"
                      }`}
                  >
                    <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-gold" : "text-white/60"}`} />
                    <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 shrink-0 bg-[#0B2942]">
            <div className="text-[11px] text-white/40 mb-2 px-1 uppercase tracking-wider font-semibold">Account</div>
            <button
              onClick={() => {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("adminToken");
                window.location.href = "/admin/login";
              }}
              className="w-full py-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-[13px] rounded-md transition-colors cursor-pointer flex items-center px-3 gap-3 font-medium min-h-[44px]"
            >
              <FaSignOutAlt className="w-3.5 h-3.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar rendering
  return (
    <aside
      className={`${isCollapsed ? "w-[80px]" : "w-[256px]"
        } bg-brand h-screen fixed top-0 left-0 flex flex-col text-white/80 transition-all duration-300 z-50 shadow-xl`}
    >
      {/* Header */}
      <div
        className={`h-14 flex items-center ${isCollapsed ? "justify-center" : "justify-between px-5"
          } border-b border-white/10 shrink-0 bg-[#0B2942]`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
              <Image
                src={IMAGES.MAPLE_LOGO}
                alt="Logo"
                fill
                sizes="32px"
                quality={100}
                unoptimized
                className="object-contain drop-shadow-md brightness-0 invert"
              />
            </div>
          </div>
        )}

        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className={`${isCollapsed ? "w-8 h-8" : "w-6 h-6"
              } flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer`}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <FaAngleDoubleRight className="w-3.5 h-3.5" />
            ) : (
              <FaAngleDoubleLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className={`flex-1 ${isCollapsed ? "overflow-visible" : "overflow-y-auto"} py-4 min-h-0`}>
        <nav className={`${isCollapsed ? "flex flex-col items-center space-y-1.5 px-0" : "px-3 space-y-1"} h-full pb-6`}>
          {navItems.map((item) => {
            if (item.subItems) {
              return (
                <NavGroup
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  isCollapsed={!!isCollapsed}
                />
              );
            }

            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href!);

            if (isCollapsed) {
              return (
                <div key={item.href} className="relative group flex justify-center w-full my-0.5">
                  <Link
                    href={item.href!}
                    className={`w-[40px] h-[40px] flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-white/15 text-gold shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/10 text-white/70 hover:text-white"
                      }`}
                    aria-label={item.label}
                  >
                    <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-gold" : "text-white/60 group-hover:text-white"}`} />
                  </Link>

                  {/* Collapsed Tooltip */}
                  <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-[#0B2942] text-white text-[12px] font-medium px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap z-[70] transition-all duration-200 border border-white/15 pointer-events-none -translate-x-2 group-hover:translate-x-0">
                    {item.label}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer mb-1 ${isActive
                  ? "bg-white/10 text-gold font-medium"
                  : "hover:bg-white/5 hover:text-white text-white/80"
                  }`}
              >
                <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-gold" : "text-white/60"}`} />
                <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={`p-3 border-t border-white/10 shrink-0 bg-[#0B2942] ${isCollapsed ? "flex justify-center" : ""}`}>
        {!isCollapsed && (
          <div className="text-[11px] text-white/40 mb-2 px-1 uppercase tracking-wider font-semibold">
            Account
          </div>
        )}

        {isCollapsed ? (
          <div className="relative group flex justify-center w-full">
            <button
              onClick={() => {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("adminToken");
                window.location.href = "/admin/login";
              }}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-md bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Logout"
            >
              <FaSignOutAlt className="w-3.5 h-3.5 shrink-0" />
            </button>
            <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-[#0B2942] text-red-300 text-[12px] font-medium px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap z-[70] transition-all duration-200 border border-white/15 pointer-events-none -translate-x-2 group-hover:translate-x-0">
              Logout
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              localStorage.removeItem("adminToken");
              window.location.href = "/admin/login";
            }}
            className="w-full py-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-[13px] rounded-md transition-colors cursor-pointer flex items-center px-3 gap-3 font-medium min-h-[44px]"
          >
            <FaSignOutAlt className="w-3.5 h-3.5 shrink-0" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}



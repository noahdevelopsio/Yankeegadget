"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ClipboardList,
  CreditCard,
  LogOut,
  User as UserIcon,
  Menu,
  X
} from "lucide-react";

interface AdminSidebarProps {
  session: {
    name: string;
    role: string;
  };
}

export default function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header (Sticky / Fixed) */}
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0 w-full z-30">
        <div className="flex items-center gap-3">
          {/* Hamburger trigger menu button visible on mobile only */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 text-ink-700 hover:text-brand-orange md:hidden transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400 block md:inline md:mr-1.5">
              Management Portal
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-ink-900 leading-tight">
              Yankee Gadgets Control Center
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[11px] sm:text-xs font-bold text-brand-orange hover:text-brand-orange-light border border-brand-orange/20 px-2.5 py-1.5 rounded-lg hover:bg-brand-orange/5 transition-all"
          >
            Live Storefront
          </Link>
        </div>
      </header>

      {/* Desktop Sidebar (Left panel - always visible on md screens) */}
      <aside className="hidden md:flex flex-col w-64 bg-ink-900 text-white shrink-0 border-r border-border/10">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-border/10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-dark.svg"
              alt="Yankee Gadgets"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-orange text-white shadow-orange-glow"
                    : "text-ink-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-brand-orange"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile footer info block */}
        <div className="p-4 border-t border-border/10 bg-black/25 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 border border-brand-orange/30">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{session.name}</p>
              <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider">{session.role}</p>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="text-ink-400 hover:text-brand-orange p-2 rounded-lg hover:bg-white/5 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Slide-Over Navigation Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop mask */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer container panel */}
          <div className="relative flex flex-col w-full max-w-xs bg-ink-900 text-white shadow-2xl transition-transform duration-300 ease-in-out">
            {/* Header close trigger */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border/10 shrink-0">
              <Link href="/" onClick={handleLinkClick}>
                <Image
                  src="/logo-dark.svg"
                  alt="Yankee Gadgets"
                  width={130}
                  height={35}
                  className="h-7 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-ink-400 hover:text-white rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-brand-orange text-white shadow-orange-glow"
                        : "text-ink-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-brand-orange"}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User profile footer info block */}
            <div className="p-4 border-t border-border/10 bg-black/25 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 border border-brand-orange/30">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{session.name}</p>
                  <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider">{session.role}</p>
                </div>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-ink-400 hover:text-brand-orange p-2 rounded-lg hover:bg-white/5 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

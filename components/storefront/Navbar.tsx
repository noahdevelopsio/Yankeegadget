"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsOpen: openCart, getItemCount } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync state for cart count safety
  useEffect(() => {
    setMounted(true);
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Phones", href: "/shop/phones" },
    { name: "Earbuds", href: "/shop/earbuds" },
    { name: "Accessories", href: "/shop/accessories" },
    { name: "Gaming", href: "/shop/gaming" },
    { name: "Consoles", href: "/shop/consoles" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-glass shadow-premium">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/logo.svg"
              alt="Yankee Gadgets"
              width={160}
              height={46}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-ink-700 hover:text-brand-orange transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search, Cart & Mobile Menu controls */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex relative max-w-xs lg:max-w-sm">
              <input
                type="text"
                placeholder="Search gadgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-alt border border-border text-ink-900 placeholder-ink-400 text-sm pl-4 pr-10 py-2.5 rounded-lg focus:bg-surface transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-700 hover:text-brand-orange transition-colors"
                aria-label="Search button"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Shop All Link */}
            <Link
              href="/shop"
              className="hidden sm:inline-block text-sm font-bold text-brand-orange hover:text-brand-orange-light transition-colors"
            >
              Shop All
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => openCart(true)}
              className="relative p-2.5 rounded-lg border border-border text-ink-900 hover:border-brand-orange/40 hover:text-brand-orange transition-all duration-200"
              aria-label="Open cart drawer"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && getItemCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-surface shadow-sm">
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* Hamburger button (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg border border-border text-ink-900 md:hidden hover:bg-surface-alt transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 pt-4 pb-6 space-y-4 shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-alt border border-border text-ink-900 placeholder-ink-400 text-sm pl-4 pr-10 py-3 rounded-lg focus:bg-surface transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-700 hover:text-brand-orange"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Links */}
          <nav className="flex flex-col space-y-3 pt-2">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-bold text-brand-orange py-2 px-3 hover:bg-surface-alt rounded-lg"
            >
              Shop All
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-ink-700 py-2 px-3 hover:bg-surface-alt rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

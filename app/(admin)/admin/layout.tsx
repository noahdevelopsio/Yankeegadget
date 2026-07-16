import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, ShoppingBag, FolderTree, ClipboardList, CreditCard, LogOut, User as UserIcon } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();

  // If there's no session, render the children directly (which will be the login page)
  if (!session) {
    return <div className="min-h-screen bg-ink-900">{children}</div>;
  }

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-surface-alt overflow-hidden">
      
      {/* Sidebar (Left panel) */}
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
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Icon className="w-5 h-5 text-brand-orange" />
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

      {/* Main Admin Console content view (Right panel) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header navbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 md:px-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">
              Management Portal
            </span>
            <h2 className="text-sm font-bold text-ink-900">
              Yankee Gadgets Control Center
            </h2>
          </div>
          
          {/* Quick exit to store trigger */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold text-brand-orange hover:text-brand-orange-light border border-brand-orange/20 px-3 py-1.5 rounded-lg hover:bg-brand-orange/5 transition-all"
            >
              Live Storefront
            </Link>
            
            {/* Mobile-only logout wrapper */}
            <form action={logoutAction} className="md:hidden">
              <button
                type="submit"
                className="text-ink-700 hover:text-brand-orange p-2 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </header>

        {/* Content body viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
          {children}
        </main>

      </div>

    </div>
  );
}

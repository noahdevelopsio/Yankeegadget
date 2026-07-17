import React from "react";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();

  // If there's no session, render the children directly (which will be the login page)
  if (!session) {
    return <div className="min-h-screen bg-ink-900">{children}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-surface-alt overflow-hidden">
      {/* Client sidebar (handles desktop aside layout + mobile slide overlay menu) */}
      <AdminSidebar session={session} />

      {/* Main Admin Console content view */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Content body viewport */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

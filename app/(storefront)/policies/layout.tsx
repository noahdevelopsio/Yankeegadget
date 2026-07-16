import React from "react";
import Link from "next/link";

interface PoliciesLayoutProps {
  children: React.ReactNode;
}

export default function PoliciesLayout({ children }: PoliciesLayoutProps) {
  const policyLinks = [
    { name: "Privacy Policy", href: "/policies/privacy" },
    { name: "Terms & Conditions", href: "/policies/terms" },
    { name: "Shipping Policy", href: "/policies/shipping" },
    { name: "Refund & Return Policy", href: "/policies/refund" },
  ];

  return (
    <div className="bg-surface-alt min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-display font-black text-ink-900 md:text-4xl">
            Legal & Store Policies
          </h1>
          <p className="text-sm text-ink-700 mt-2">
            Please read through our store terms, privacy standards, and shipping conditions.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Links */}
          <aside className="md:col-span-4 bg-white p-6 rounded-xl border border-border shadow-premium space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-3 px-3">
              Store Documents
            </h3>
            <nav className="space-y-1">
              {policyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-ink-700 hover:text-brand-orange hover:bg-surface-alt transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Right Content Panel */}
          <main className="md:col-span-8 bg-white p-6 sm:p-10 rounded-xl border border-border shadow-premium prose prose-ink max-w-none">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
}

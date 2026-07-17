import React, { Suspense } from "react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import CartDrawer from "@/components/storefront/CartDrawer";
import WhatsAppButton from "@/components/storefront/WhatsAppButton";

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  return (
    <>
      {/* Navbar inside suspense because it uses useSearchParams */}
      <Suspense fallback={
        <div className="h-16 border-b border-border bg-glass animate-pulse" />
      }>
        <Navbar />
      </Suspense>

      {/* Global Cart Slide-in Drawer */}
      <CartDrawer />

      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Storefront Footer */}
      <Footer />

      {/* Floating WhatsApp Action Widget */}
      <WhatsAppButton />
    </>
  );
}

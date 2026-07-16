import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Shield, Sparkles, Truck, Check } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Yankee Gadgets",
  description: "Learn about Yankee Gadgets, the leading provider of premium Grade A US/UK-used tech in Nigeria.",
};

export default function AboutPage() {
  return (
    <div className="bg-surface-alt min-h-screen py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl font-display font-black text-ink-900 md:text-5xl">
            Premium US & UK Used Gadgets
          </h1>
          <p className="text-base text-ink-700 max-w-2xl mx-auto leading-relaxed">
            Yankee Gadgets was founded with a single mission: to deliver original, high-performance gadgets from the US and UK directly to tech enthusiasts in Nigeria, without the high costs of brand-new retail.
          </p>
        </div>

        {/* Brand values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-premium space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-ink-900">Tested Quality</h3>
            <p className="text-xs text-ink-700 leading-relaxed">
              Every phone, console, and earbud undergoes a strict 21-point functional diagnostics test before listing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-premium space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-ink-900">Premium Grade A</h3>
            <p className="text-xs text-ink-700 leading-relaxed">
              We deal strictly in Grade A used gadgets. Minimal to zero cosmetic wear, maximum battery capacity, and zero faults.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-premium space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-ink-900">Swift Delivery</h3>
            <p className="text-xs text-ink-700 leading-relaxed">
              Fast mainland and island dispatch within Lagos, and reliable country-wide courier tracking.
            </p>
          </div>
        </div>

        {/* Company Details section */}
        <div className="bg-white rounded-2xl border border-border p-8 sm:p-10 shadow-premium grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-black text-ink-900">
              Why Shop With Us?
            </h2>
            <p className="text-sm text-ink-700 leading-relaxed">
              We understand that buying used electronics online can be stressful. That is why we offer transparency, warranty structures, and swift delivery support.
            </p>
            <ul className="space-y-2.5 text-xs text-ink-900 font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Supplier warranties on all phones and consoles</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Secure payments via Flutterwave (USSD, Transfer, Cards)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Physical showroom in Ikeja, Lagos for inspection</span>
              </li>
            </ul>
            <div className="pt-4">
              <Link
                href="/shop"
                className="bg-brand-orange hover:bg-brand-orange-light text-white font-bold px-6 py-3 rounded-lg text-sm inline-block shadow-premium"
              >
                Browse Our Catalog
              </Link>
            </div>
          </div>
          <div className="relative h-64 rounded-xl bg-surface-alt border border-border overflow-hidden">
            {/* Display a modern vector background or premium imagery placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/20 to-brand-orange/5 flex items-center justify-center">
              <span className="text-sm font-display font-bold text-brand-orange tracking-widest uppercase">
                Yankee Gadgets Hub
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

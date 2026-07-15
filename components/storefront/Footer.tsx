import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-white border-t border-border/10 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Logo & About */}
          <div className="space-y-4">
            <Image
              src="/logo-dark.svg"
              alt="Yankee Gadgets"
              width={160}
              height={46}
              className="h-9 w-auto object-contain mb-4"
            />
            <p className="text-sm text-ink-400 max-w-xs leading-relaxed">
              Premium services, Unbeatable Price. Get the latest iPhones, gaming consoles, earbuds, and accessories directly to your doorstep in Lagos and nationwide.
            </p>
          </div>

          {/* Store Location & Contacts */}
          <div className="space-y-4">
            <h3 className="text-sm font-display uppercase tracking-wider font-bold text-white">
              Contact & Store
            </h3>
            <ul className="space-y-3 text-sm text-ink-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span>
                  1st Floor, Taiyelolu Tower, 2A Olaide Tomori St, Ikeja, Lagos
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                <span>+234 803 000 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-brand-orange shrink-0" />
                <span>info@yankeegadgets.ng</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p className="text-xs text-ink-400">Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-display uppercase tracking-wider font-bold text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-ink-400">
              <li>
                <Link href="/shop" className="hover:text-brand-orange transition-colors">Shop All</Link>
              </li>
              <li>
                <Link href="/shop/phones" className="hover:text-brand-orange transition-colors">Phones</Link>
              </li>
              <li>
                <Link href="/shop/consoles" className="hover:text-brand-orange transition-colors">Gaming Consoles</Link>
              </li>
              <li>
                <Link href="/shop/earbuds" className="hover:text-brand-orange transition-colors">Wireless Earbuds</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Company Policies */}
          <div className="space-y-4">
            <h3 className="text-sm font-display uppercase tracking-wider font-bold text-white">
              Policies
            </h3>
            <ul className="space-y-2 text-sm text-ink-400">
              <li>
                <Link href="/policies/delivery-returns" className="hover:text-brand-orange transition-colors">Delivery & Returns</Link>
              </li>
              <li>
                <Link href="/policies/warranty" className="hover:text-brand-orange transition-colors">Warranty Policy</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-orange transition-colors">FAQs & Support</Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-brand-orange transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright block */}
        <div className="border-t border-border/10 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-400 gap-4">
          <p>© {currentYear} Yankee Gadgets. All rights reserved.</p>
          <p>
            Designed for premium speed & security. Payments secured by{" "}
            <span className="text-white font-semibold">Flutterwave</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}

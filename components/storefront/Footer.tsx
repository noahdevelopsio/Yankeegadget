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
                <span>Call: +234 807 308 3426</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-brand-orange shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.392 9.806-9.799.002-2.618-1.01-5.079-2.859-6.93C16.378 2.025 13.926.982 11.312.982c-5.4.001-9.79 4.394-9.794 9.8 0 1.554.439 3.076 1.272 4.417L1.8 20.317l5.303-1.393c1.118.608 2.274.927 3.544.927h.001zm10.743-7.234c-.305-.152-1.802-.888-2.082-.99-.28-.102-.485-.152-.687.152-.202.305-.783.99-.96 1.192-.177.202-.355.228-.66.076-.305-.152-1.288-.475-2.454-1.517-.9-.803-1.508-1.794-1.685-2.099-.177-.305-.019-.47.133-.621.137-.137.305-.355.457-.533.152-.177.202-.305.305-.508.102-.202.051-.381-.025-.533-.076-.152-.687-1.653-.941-2.262-.247-.594-.5-.513-.687-.523-.177-.008-.38-.011-.583-.011-.203 0-.533.076-.812.381-.28.305-1.066 1.041-1.066 2.54 0 1.498 1.091 2.943 1.243 3.146.152.202 2.148 3.28 5.203 4.602.726.313 1.291.5 1.733.64.73.232 1.393.197 1.917.12.584-.086 1.802-.736 2.057-1.447.255-.71.255-1.32.178-1.447-.076-.127-.28-.203-.584-.355z"/>
                </svg>
                <span>WhatsApp: +234 903 703 6463</span>
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

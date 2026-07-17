import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yankee Gadgets | Premium Gadgets at Unbeatable Prices in Lagos",
    template: "%s | Yankee Gadgets",
  },
  description:
    "Yankee Gadgets is the leading retailer for iPhones, PlayStation consoles, games, wireless earbuds, and phone accessories in Ikeja, Lagos. Shop online with secure payments and fast delivery.",
  keywords: [
    "gadgets store Ikeja",
    "buy iPhone Lagos",
    "PlayStation Lagos",
    "earpods shop Lagos",
    "Yankee Gadgets",
    "computer village online",
  ],
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Yankee Gadgets | Premium Gadgets at Unbeatable Prices",
    description:
      "Shop the latest iPhones, PS5, gaming titles, earbuds, and accessories in Lagos. Fast delivery and secure checkout.",
    url: "/",
    siteName: "Yankee Gadgets",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen bg-white text-ink-900 selection:bg-brand-orange/20 selection:text-brand-orange">
        {children}
      </body>
    </html>
  );
}

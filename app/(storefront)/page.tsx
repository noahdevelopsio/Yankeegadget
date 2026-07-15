import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/storefront/ProductCard";
import { ShieldCheck, Truck, CreditCard, ArrowRight } from "lucide-react";

// Mock Fallback Data in case Prisma DB is not synced/available yet
const FALLBACK_CATEGORIES = [
  { id: "c1", name: "Phones", slug: "phones", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop" },
  { id: "c2", name: "Earbuds", slug: "earbuds", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop" },
  { id: "c3", name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=400&auto=format&fit=crop" },
  { id: "c4", name: "Gaming", slug: "gaming", image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=400&auto=format&fit=crop" },
  { id: "c5", name: "Consoles", slug: "consoles", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400&auto=format&fit=crop" },
];

const FALLBACK_PRODUCTS = [
  {
    id: "p1",
    name: "iPhone 15 Pro Max 256GB",
    slug: "iphone-15-pro-max-256gb",
    brand: "Apple",
    price: 185000000,
    compareAtPrice: 195000000,
    stock: 12,
    images: [{ url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop", altText: "iPhone 15 Pro Max" }],
  },
  {
    id: "p2",
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    brand: "Samsung",
    price: 175000000,
    compareAtPrice: 185000000,
    stock: 8,
    images: [{ url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop", altText: "Galaxy S24 Ultra" }],
  },
  {
    id: "p3",
    name: "Sony WF-1000XM5 Wireless Earbuds",
    slug: "sony-wf-1000xm5-earbuds",
    brand: "Sony",
    price: 25000000,
    compareAtPrice: 28000000,
    stock: 15,
    images: [{ url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop", altText: "Sony WF-1000XM5" }],
  },
  {
    id: "p4",
    name: "PlayStation 5 Slim Digital Edition",
    slug: "playstation-5-slim-digital",
    brand: "Sony",
    price: 64000000,
    compareAtPrice: 68000000,
    stock: 6,
    images: [{ url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop", altText: "PS5 Slim Digital" }],
  },
];

export const revalidate = 60; // Revalidate page data every 60s (ISR)

async function getHomeData() {
  try {
    const categories = await prisma.category.findMany({
      take: 5,
    });
    
    const newArrivals = await prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
    });

    const bestSellers = await prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { stock: "asc" }, // simulating high demand by low stock
      take: 4,
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
    });

    // If DB is empty, use fallbacks
    return {
      categories: categories.length > 0 ? categories : FALLBACK_CATEGORIES,
      newArrivals: newArrivals.length > 0 ? newArrivals : FALLBACK_PRODUCTS,
      bestSellers: bestSellers.length > 0 ? bestSellers : FALLBACK_PRODUCTS.slice().reverse(),
      dbConnected: true,
    };
  } catch (error) {
    console.warn("Database connection failed, serving mock fallback data on Homepage:", error);
    return {
      categories: FALLBACK_CATEGORIES,
      newArrivals: FALLBACK_PRODUCTS,
      bestSellers: FALLBACK_PRODUCTS.slice().reverse(),
      dbConnected: false,
    };
  }
}

export default async function HomePage() {
  const { categories, newArrivals, bestSellers, dbConnected } = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* DB Sync Indicator Banner for development */}
      {!dbConnected && (
        <div className="bg-warning/15 text-warning text-xs font-semibold py-2.5 px-4 text-center border-b border-warning/20">
          ⚠️ Running in Mock Data mode. Connect a database and run migrations to display live products.
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink-900 text-white py-20 lg:py-32">
        {/* Glowing Ambient Background Lights */}
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-brand-orange/20 blur-[120px]" />
        <div className="absolute left-1/3 bottom-10 h-[300px] w-[300px] rounded-full bg-[#FF7A33]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text description */}
            <div className="lg:col-span-7 space-y-6 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-orange/20 text-brand-orange tracking-wider uppercase">
                New Arrival
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.05] tracking-tight">
                PLAYSTATION 5 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-orange-light text-glow">
                  SLIM EDITION
                </span>
              </h1>
              <p className="text-base sm:text-lg text-ink-400 leading-relaxed font-sans max-w-xl">
                Experience lightning-fast loading, deeper immersion, and an all-new generation of incredible games. Get the PS5 Slim in Lagos at unbeatable rates.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/product/playstation-5-slim-digital"
                  className="bg-brand-orange text-white hover:bg-brand-orange-light px-8 py-4 rounded-xl text-base font-bold shadow-orange-glow transition-all duration-200"
                >
                  Buy Now
                </Link>
                <Link
                  href="/shop"
                  className="border border-border/20 text-white hover:bg-white/5 hover:border-white/30 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200"
                >
                  Explore Store
                </Link>
              </div>
            </div>

            {/* Featured Image Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 filter drop-shadow-[0_20px_50px_rgba(255,61,0,0.25)]">
                <Image
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop"
                  alt="PlayStation 5 Slim Showcase"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Strip Section */}
      <section className="bg-surface-alt border-y border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Delivery Item */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-ink-900 uppercase tracking-wider">Fast Delivery</h3>
                <p className="text-xs text-ink-700">Same-day delivery in Lagos. Dispatch across Nigeria.</p>
              </div>
            </div>

            {/* Warranty Item */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-ink-900 uppercase tracking-wider">Official Warranty</h3>
                <p className="text-xs text-ink-700">Genuine items only with store warranty policies.</p>
              </div>
            </div>

            {/* Payment Item */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-ink-900 uppercase tracking-wider">Secure Checkout</h3>
                <p className="text-xs text-ink-700">Card, bank transfer, & USSD via Flutterwave.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Tiles Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                Browse
              </span>
              <h2 className="text-3xl font-display font-bold text-ink-900 mt-1">
                Shop By Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-1 text-sm font-bold text-brand-orange hover:text-brand-orange-light transition-colors"
            >
              <span>See All Shop</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const imageSrc = ("image" in cat ? (cat.image as string) : "") || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop";
              return (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  className="group relative flex flex-col h-48 overflow-hidden rounded-xl bg-surface-alt border border-border transition-all duration-300 hover:border-brand-orange/40 hover:shadow-premium"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={cat.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4" />
                    <h3 className="absolute bottom-4 left-4 font-display font-bold text-white text-lg tracking-wide z-10">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-surface-alt border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                Fresh Drops
              </span>
              <h2 className="text-3xl font-display font-bold text-ink-900 mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-1 text-sm font-bold text-brand-orange hover:text-brand-orange-light transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                Popularity
              </span>
              <h2 className="text-3xl font-display font-bold text-ink-900 mt-1">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-1 text-sm font-bold text-brand-orange hover:text-brand-orange-light transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}

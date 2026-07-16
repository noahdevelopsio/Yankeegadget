import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/storefront/ProductCard";
import HeroSlider from "@/components/storefront/HeroSlider";
import { ShieldCheck, Truck, CreditCard, ArrowRight } from "lucide-react";

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

    return {
      categories,
      newArrivals,
      bestSellers,
    };
  } catch (error) {
    console.error("Database query failed on Homepage:", error);
    return {
      categories: [],
      newArrivals: [],
      bestSellers: [],
    };
  }
}

export default async function HomePage() {
  const { categories, newArrivals, bestSellers } = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen">



      {/* Hero Rotating Slideshow */}
      <HeroSlider />

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
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 px-2 sm:px-0">
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {categories.map((cat) => {
              const categoryImages: Record<string, string> = {
                phones: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop",
                earbuds: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop",
                accessories: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=400&auto=format&fit=crop",
                gaming: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=400&auto=format&fit=crop",
                consoles: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400&auto=format&fit=crop",
              };
              const imageSrc = categoryImages[cat.slug] || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop";
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
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 px-2 sm:px-0">
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 px-2 sm:px-0">
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

import React from "react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/storefront/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60; // ISR revalidation every 60 seconds

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const FALLBACK_CATEGORIES = [
  {
    name: "Phones",
    slug: "phones",
    intro: "Upgrade to the latest smartphones in Nigeria. From Apple iPhones to Samsung Galaxy series, Yankee Gadgets offers premium mobile phones with store warranty and fast delivery across Lagos and nationwide. Buy high-spec devices at the best market prices."
  },
  {
    name: "Earbuds",
    slug: "earbuds",
    intro: "Experience pristine audio with our curated selection of wireless earbuds and headphones in Lagos. We source noise-canceling earphones from top brands like Sony, Apple, and Bose. Unmatched sound, quick pairing, and long battery life."
  },
  {
    name: "Accessories",
    slug: "accessories",
    intro: "Equip your devices with top-quality accessories. From Apple fast chargers and power adapters to high-performance PlayStation controllers and HDMI cables, Yankee Gadgets keeps you connected with genuine accessories built to last."
  },
  {
    name: "Gaming",
    slug: "gaming",
    intro: "Dive into incredible virtual worlds. Explore our collections of top-rated PlayStation 5 games, new arrivals, and popular multiplayer titles in Ikeja, Lagos. Best prices on physical disc games and expansions."
  },
  {
    name: "Consoles",
    slug: "consoles",
    intro: "Get the latest gaming consoles in Nigeria. We stock the PlayStation 5 Slim Disc and Digital Editions, offering lightning-fast loading, immersive haptics, and spectacular 4K gaming. Rest assured with genuine consoles and store warranty support."
  }
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
    categorySlug: "phones",
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
    categorySlug: "phones",
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
    categorySlug: "earbuds",
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
    categorySlug: "consoles",
    images: [{ url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop", altText: "PS5 Slim Digital" }],
  },
  {
    id: "p5",
    name: "Apple AirPods Pro 2",
    slug: "apple-airpods-pro-2",
    brand: "Apple",
    price: 32000000,
    compareAtPrice: null,
    stock: 20,
    categorySlug: "earbuds",
    images: [{ url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop", altText: "AirPods Pro 2" }],
  },
  {
    id: "p6",
    name: "PlayStation 5 Disc Edition",
    slug: "playstation-5-disc-edition",
    brand: "Sony",
    price: 72000000,
    compareAtPrice: null,
    stock: 4,
    categorySlug: "consoles",
    images: [{ url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop", altText: "PS5 Disc Edition" }],
  },
  {
    id: "p7",
    name: "DualSense Edge Wireless Controller",
    slug: "dualsense-edge-wireless-controller",
    brand: "Sony",
    price: 24000000,
    compareAtPrice: null,
    stock: 10,
    categorySlug: "accessories",
    images: [{ url: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=600&auto=format&fit=crop", altText: "DualSense Edge" }],
  },
  {
    id: "p8",
    name: "Apple 20W USB-C Power Adapter",
    slug: "apple-20w-usbc-power-adapter",
    brand: "Apple",
    price: 2500000,
    compareAtPrice: 3000000,
    stock: 50,
    categorySlug: "accessories",
    images: [{ url: "https://images.unsplash.com/photo-1619137839356-9e8a946cf61c?q=80&w=600&auto=format&fit=crop", altText: "Apple 20W Adapter" }],
  },
];

async function getCategoryData(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return {
        category: null,
        products: [],
        dbConnected: true,
      };
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id,
        isPublished: true,
      },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Determine fallback description intro
    const fallbackCat = FALLBACK_CATEGORIES.find(c => c.slug === slug);
    const categoryWithIntro = {
      ...category,
      intro: fallbackCat ? fallbackCat.intro : `Shop top quality products and accessories under the ${category.name} category. Premium devices at unbeatable prices.`
    };

    return {
      category: categoryWithIntro,
      products: products.length > 0 ? products : [],
      dbConnected: true,
    };
  } catch (error) {
    console.warn("Database connection failed, serving mock fallback data on Category Page:", error);

    const fallbackCat = FALLBACK_CATEGORIES.find(c => c.slug === slug);
    const mockCategory = fallbackCat
      ? { id: `m-${slug}`, name: fallbackCat.name, slug: fallbackCat.slug, intro: fallbackCat.intro }
      : null;

    const mockProducts = FALLBACK_PRODUCTS.filter(p => p.categorySlug === slug);

    return {
      category: mockCategory,
      products: mockProducts,
      dbConnected: false,
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, products, dbConnected } = await getCategoryData(params.category);

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-display font-bold text-ink-900 mb-4">
          Category Not Found
        </h2>
        <p className="text-sm text-ink-700 mb-8">
          The category &quot;{params.category}&quot; does not exist on our store.
        </p>
        <Link
          href="/shop"
          className="bg-brand-orange text-white hover:bg-brand-orange-light px-6 py-3 rounded-lg text-sm font-semibold transition-colors inline-block"
        >
          Go back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-12">


      {/* Back button link */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-700 hover:text-brand-orange transition-colors mb-6 px-2 sm:px-0"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all products</span>
      </Link>

      {/* Category Header & Intro Paragraph (SEO Target) */}
      <div className="max-w-3xl border-b border-border pb-8 mb-10 px-2 sm:px-0">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
          Category Portfolio
        </span>
        <h1 className="text-4xl font-display font-black text-ink-900 mt-1 mb-4">
          Shop {category.name}
        </h1>
        <p className="text-sm sm:text-base text-ink-700 leading-relaxed font-sans">
          {category.intro}
        </p>
      </div>

      {/* Scoped Products Grid */}
      {products.length === 0 ? (
        <div className="bg-surface-alt border border-border rounded-xl p-12 text-center mx-2 sm:mx-0">
          <h3 className="text-lg font-display font-bold text-ink-900 mb-2">
            No products in this category yet
          </h3>
          <p className="text-sm text-ink-700 mb-6">
            We are working on bringing premium {category.name} items to our online store soon. In the meantime, you can browse other gadgets.
          </p>
          <Link
            href="/shop"
            className="bg-brand-orange text-white hover:bg-brand-orange-light px-6 py-3 rounded-lg text-sm font-semibold inline-block transition-colors"
          >
            Browse Other Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

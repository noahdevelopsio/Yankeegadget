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

const CATEGORY_INTROS: Record<string, string> = {
  phones: "Upgrade to the latest smartphones in Nigeria. From Apple iPhones to Samsung Galaxy series, Yankee Gadgets offers premium mobile phones with store warranty and fast delivery across Lagos and nationwide. Buy high-spec devices at the best market prices.",
  earbuds: "Experience pristine audio with our curated selection of wireless earbuds and headphones in Lagos. We source noise-canceling earphones from top brands like Sony, Apple, and Bose. Unmatched sound, quick pairing, and long battery life.",
  accessories: "Equip your devices with top-quality accessories. From Apple fast chargers and power adapters to high-performance PlayStation controllers and HDMI cables, Yankee Gadgets keeps you connected with genuine accessories built to last.",
  gaming: "Dive into incredible virtual worlds. Explore our collections of top-rated PlayStation 5 games, new arrivals, and popular multiplayer titles in Ikeja, Lagos. Best prices on physical disc games and expansions.",
  consoles: "Get the latest gaming consoles in Nigeria. We stock the PlayStation 5 Slim Disc and Digital Editions, offering lightning-fast loading, immersive haptics, and spectacular 4K gaming. Rest assured with genuine consoles and store warranty support."
};

async function getCategoryData(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return {
        category: null,
        products: [],
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

    const categoryWithIntro = {
      ...category,
      intro: CATEGORY_INTROS[slug] || `Shop top quality products and accessories under the ${category.name} category. Premium devices at unbeatable prices.`
    };

    return {
      category: categoryWithIntro,
      products,
    };
  } catch (error) {
    console.error("Database connection failed on Category Page:", error);
    return {
      category: null,
      products: [],
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, products } = await getCategoryData(params.category);

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

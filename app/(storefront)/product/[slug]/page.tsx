import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductImageGallery from "@/components/storefront/ProductImageGallery";
import ProductDetailsPanel from "@/components/storefront/ProductDetailsPanel";
import ProductCard from "@/components/storefront/ProductCard";
import { ShieldCheck, Truck, RotateCcw, ChevronRight } from "lucide-react";

export const revalidate = 60; // ISR revalidation every 60s

// Mock Fallback Products in case database is empty or connection fails
const FALLBACK_PRODUCTS = [
  {
    id: "p1",
    name: "iPhone 15 Pro Max 256GB",
    slug: "iphone-15-pro-max-256gb",
    brand: "Apple",
    description: "Experience the ultimate iPhone with a titanium design, revolutionary new 48MP main camera, and the industry-leading A17 Pro chip. The lightweight aerospace-grade titanium build makes it incredibly strong yet comfortable to hold.",
    shortDescription: "Titanium design, A17 Pro chip, Action button, and 5x Telephoto camera.",
    price: 185000000,
    compareAtPrice: 195000000,
    stock: 12,
    sku: "AP-IP15PM-256",
    specs: {
      "Screen Size": "6.7 inches",
      "Processor": "A17 Pro",
      "Storage": "256GB",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
      "Weight": "221g"
    },
    images: [{ url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop", altText: "iPhone 15 Pro Max" }],
    variants: [
      { id: "v1", name: "Color", value: "Natural Titanium", priceDiff: 0, stock: 5 },
      { id: "v2", name: "Color", value: "Blue Titanium", priceDiff: 0, stock: 4 },
      { id: "v3", name: "Color", value: "Black Titanium", priceDiff: 0, stock: 3 }
    ],
    category: { name: "Phones", slug: "phones" }
  },
  {
    id: "p3",
    name: "Sony WF-1000XM5 Wireless Earbuds",
    slug: "sony-wf-1000xm5-earbuds",
    brand: "Sony",
    description: "The WF-1000XM5 features cutting-edge technology to deliver premium sound quality and the best truly wireless noise-canceling performance on the market.",
    shortDescription: "The best noise-canceling earbuds with high-res audio and crystal-clear calls.",
    price: 25000000,
    compareAtPrice: 28000000,
    stock: 15,
    sku: "SN-WF1000XM5",
    specs: {
      "Battery Life": "Up to 8 hours (24 hours with case)",
      "Bluetooth Version": "5.3",
      "Water Resistance": "IPX4",
      "Noise Cancelling": "Yes, dual processors"
    },
    images: [{ url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop", altText: "Sony WF-1000XM5" }],
    variants: [
      { id: "v4", name: "Color", value: "Black", priceDiff: 0, stock: 10 },
      { id: "v5", name: "Color", value: "Silver", priceDiff: 0, stock: 5 }
    ],
    category: { name: "Earbuds", slug: "earbuds" }
  },
  {
    id: "p4",
    name: "PlayStation 5 Slim Digital Edition",
    slug: "playstation-5-slim-digital",
    brand: "Sony",
    description: "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio, and an all-new generation of incredible PlayStation games.",
    shortDescription: "Slim design, 1TB SSD storage, haptic feedback, 4K gaming, and digital-only play.",
    price: 64000000,
    compareAtPrice: 68000000,
    stock: 6,
    sku: "SN-PS5S-DIG",
    specs: {
      "Storage Capacity": "1TB custom SSD",
      "Graphics": "Ray Tracing Acceleration, up to 120fps with 120Hz output",
      "Audio": "Tempest 3D AudioTech"
    },
    images: [{ url: "/ps5_black_bg_1784215126064.png", altText: "PS5 Slim Digital" }],
    variants: [],
    category: { name: "Consoles", slug: "consoles" }
  }
];

async function getProductDetail(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        variants: true,
        category: true,
      },
    });

    if (!product) {
      const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
      return { product: fallback || null, dbConnected: true };
    }

    return { product, dbConnected: true };
  } catch (error) {
    console.warn("Database connection failed, serving mock product detail:", error);
    const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    return { product: fallback || null, dbConnected: false };
  }
}

async function getRelatedProducts(categoryId: string, excludeProductId: string, dbConnected: boolean) {
  if (!dbConnected) {
    return FALLBACK_PRODUCTS.filter((p) => p.id !== excludeProductId).slice(0, 4);
  }
  try {
    return await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeProductId },
        isPublished: true,
      },
      take: 4,
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
    });
  } catch (error) {
    return FALLBACK_PRODUCTS.filter((p) => p.id !== excludeProductId).slice(0, 4);
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { product, dbConnected } = await getProductDetail(params.slug);

  if (!product) {
    notFound();
  }

  // Related Recommendations
  const categoryId = (product as any).categoryId || "";
  const relatedProducts = await getRelatedProducts(categoryId, product.id, dbConnected);

  // Parse specs JSON safely
  const specsTable: Record<string, string> = typeof product.specs === "object" && product.specs !== null
    ? (product.specs as Record<string, string>)
    : {};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* DB Sync Indicator Banner for development */}
      {!dbConnected && (
        <div className="bg-warning/15 text-warning text-xs font-semibold py-2.5 px-4 rounded-lg mb-8 text-center border border-warning/20">
          ⚠️ Running in Mock Data mode. Connect your database and run seed migrations to display live products.
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-400 mb-8 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-brand-orange transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-ink-300" />
        <Link href="/shop" className="hover:text-brand-orange transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-ink-300" />
            <Link
              href={`/shop/${product.category.slug}`}
              className="hover:text-brand-orange transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-ink-300" />
        <span className="text-ink-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main product card showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        {/* Left Column: Image viewer */}
        <div className="lg:col-span-7">
          <ProductImageGallery images={product.images} />
        </div>

        {/* Right Column: Buying Controls */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-premium">
          <ProductDetailsPanel product={product as any} />
        </div>
      </div>

      {/* Details Sections: Description & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border pt-12 mb-16">
        {/* Description details */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display font-black text-xl text-ink-900 uppercase tracking-tight">
            Product Overview
          </h2>
          <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line font-sans">
            {product.description}
          </p>

          {/* Quick trust specifications strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="flex items-center gap-3 p-3 bg-surface-alt border border-border/40 rounded-lg">
              <Truck className="w-5 h-5 text-brand-orange shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-ink-900">Same-Day Delivery</h4>
                <p className="text-[10px] text-ink-400">Available across Lagos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-alt border border-border/40 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-brand-orange shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-ink-900">Genuine Gadget</h4>
                <p className="text-[10px] text-ink-400">100% Original Sealed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-alt border border-border/40 rounded-lg">
              <RotateCcw className="w-5 h-5 text-brand-orange shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-ink-900">Easy Returns</h4>
                <p className="text-[10px] text-ink-400">Hassle-free replacement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display font-black text-xl text-ink-900 uppercase tracking-tight">
            Specifications
          </h2>
          {Object.keys(specsTable).length > 0 ? (
            <div className="border border-border rounded-xl overflow-hidden shadow-premium bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <tbody>
                  {Object.entries(specsTable).map(([key, value], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? "bg-surface-alt/40 border-b border-border/40" : "bg-white border-b border-border/40"}
                    >
                      <td className="px-4 py-3 font-bold text-ink-700 w-1/3 border-r border-border/40">
                        {key}
                      </td>
                      <td className="px-4 py-3 text-ink-900 font-medium">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-ink-400 bg-surface-alt p-4 rounded-xl border border-border/40">
              No technical specifications listed for this product.
            </p>
          )}
        </div>
      </div>

      {/* Recommendations Slider */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-border">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-black text-xl sm:text-2xl text-ink-900 uppercase tracking-tight">
              Recommended Products
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

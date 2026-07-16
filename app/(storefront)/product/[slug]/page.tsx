import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductImageGallery from "@/components/storefront/ProductImageGallery";
import ProductDetailsPanel from "@/components/storefront/ProductDetailsPanel";
import ProductCard from "@/components/storefront/ProductCard";
import { ShieldCheck, Truck, RotateCcw, ChevronRight } from "lucide-react";

export const revalidate = 60; // ISR revalidation every 60s

async function getProductDetail(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        variants: true,
        category: true,
      },
    });
  } catch (error) {
    console.error("Database connection failed on Product Detail:", error);
    return null;
  }
}

async function getRelatedProducts(categoryId: string, excludeProductId: string) {
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
    console.error("Failed to query related products:", error);
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductDetail(params.slug);

  if (!product) {
    notFound();
  }

  // Related Recommendations
  const categoryId = product.categoryId || "";
  const relatedProducts = await getRelatedProducts(categoryId, product.id);

  // Parse specs JSON safely
  const specsTable: Record<string, string> = typeof product.specs === "object" && product.specs !== null
    ? (product.specs as Record<string, string>)
    : {};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">


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

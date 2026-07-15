"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    price: number; // in kobo
    compareAtPrice: number | null; // in kobo
    stock: number;
    images: { url: string; altText: string | null }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);

    const imageUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop";

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: imageUrl,
      price: product.price,
    }, 1);

    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  // Badges calculations
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  // Let's compute discount percentage
  const discountPercent = hasDiscount && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const mainImageUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop";
  const imageAlt = product.images?.[0]?.altText || product.name;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:shadow-premium-hover"
    >
      {/* Product Image & Badges Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-alt">
        <Image
          src={mainImageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dynamic Badge Overlays */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="bg-error text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-warning text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Only {product.stock} Left
            </span>
          ) : null}

          {hasDiscount && !isOutOfStock && (
            <span className="bg-brand-orange text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Hover quick add to cart overlay for desktop */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-ink-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 z-10">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex items-center gap-2 bg-brand-orange text-white hover:bg-brand-orange-light px-5 py-2.5 rounded-lg text-sm font-semibold shadow-premium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Info details */}
      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1">
            {product.brand}
          </span>
        )}
        
        <h3 className="text-sm font-semibold text-ink-900 line-clamp-2 leading-snug group-hover:text-brand-orange transition-colors flex-1 mb-2">
          {product.name}
        </h3>

        {/* Price layout */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold font-display text-brand-orange">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && product.compareAtPrice && (
            <span className="text-xs text-ink-400 line-through font-display font-medium">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

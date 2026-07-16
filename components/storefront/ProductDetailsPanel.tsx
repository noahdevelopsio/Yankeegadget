"use client";

import React, { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";

interface ProductDetailsPanelProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    images: { url: string; altText: string | null }[];
    variants: { id: string; name: string; value: string; priceDiff: number; stock: number }[];
  };
}

export default function ProductDetailsPanel({ product }: ProductDetailsPanelProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

  // Group variants by name (e.g. { Color: ["Natural Titanium", "Blue Titanium"] })
  const variantGroups: Record<string, typeof product.variants> = {};
  product.variants.forEach((v) => {
    if (!variantGroups[v.name]) {
      variantGroups[v.name] = [];
    }
    variantGroups[v.name].push(v);
  });

  // Calculate adjusted price based on selected variants diffs
  let priceAdjust = 0;
  Object.entries(selectedVariants).forEach(([name, val]) => {
    const matchingVar = product.variants.find((v) => v.name === name && v.value === val);
    if (matchingVar) {
      priceAdjust += matchingVar.priceDiff;
    }
  });

  const finalPrice = product.price + priceAdjust;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > finalPrice;
  const isOutOfStock = product.stock === 0;

  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const mainImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop";
    
    // Construct variant payload summary e.g. "Color: Blue Titanium"
    const variantInfo = Object.keys(selectedVariants).length > 0
      ? JSON.stringify(selectedVariants)
      : undefined;

    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: mainImage,
        price: finalPrice,
        variantInfo,
      },
      quantity
    );

    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Brand & Stock Header */}
      <div className="space-y-2">
        {product.brand && (
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            {product.brand}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-display font-black text-ink-900 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-2">
          {isOutOfStock ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-error/10 text-error">
              Out of Stock
            </span>
          ) : product.stock <= 3 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning/10 text-warning">
              Only {product.stock} items left
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Pricing block */}
      <div className="flex items-baseline gap-3 bg-surface-alt p-4 rounded-xl border border-border/40">
        <span className="text-2xl sm:text-3xl font-black font-display text-brand-orange">
          {formatPrice(finalPrice)}
        </span>
        {hasDiscount && product.compareAtPrice && (
          <span className="text-sm sm:text-base text-ink-400 line-through font-display font-semibold">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>

      {/* Variant Selection */}
      {Object.keys(variantGroups).map((name) => (
        <div key={name} className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-ink-700">
            Select {name}
          </span>
          <div className="flex flex-wrap gap-2">
            {variantGroups[name].map((v) => {
              const isSelected = selectedVariants[name] === v.value;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariants(prev => ({ ...prev, [name]: v.value }))}
                  className={`px-4 py-2 text-xs font-bold border rounded-lg transition-all ${
                    isSelected
                      ? "border-brand-orange bg-brand-orange/5 text-brand-orange shadow-sm"
                      : "border-border text-ink-700 hover:border-ink-400 bg-white"
                  }`}
                >
                  {v.value}
                  {v.priceDiff > 0 && ` (+${formatPrice(v.priceDiff)})`}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quantity & Add to Cart Action */}
      {!isOutOfStock && (
        <div className="space-y-4 pt-4 border-t border-border/40">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-700">Quantity</span>
            <div className="flex items-center border border-border rounded-lg bg-white">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2.5 text-ink-400 hover:text-ink-900 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-ink-900">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="p-2.5 text-ink-400 hover:text-ink-900 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-light disabled:bg-brand-orange/60 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-orange-glow text-base"
          >
            {isAdding ? (
              <>
                <Check className="w-5 h-5 animate-pulse" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

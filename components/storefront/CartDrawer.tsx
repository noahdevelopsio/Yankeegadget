"use client";

import React, { useEffect, useState } from "react";
import { useCartStore, CartItem } from "@/lib/cartStore";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getSubtotal, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Sync/hydrate Zustand store on client mount to prevent SSR mismatch
  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        {/* Sliding Panel */}
        <div className="w-screen max-w-md transform transition-all duration-300 ease-out bg-surface shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-display text-ink-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-orange" />
              Your Cart
              {mounted && getItemCount() > 0 && (
                <span className="text-xs bg-brand-orange text-white px-2 py-0.5 rounded-full font-sans">
                  {getItemCount()}
                </span>
              )}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ink-700 hover:text-brand-orange p-1 rounded-full hover:bg-surface-alt transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 py-6 overflow-y-auto px-6 no-scrollbar">
            {!mounted || items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-ink-400" />
                </div>
                <h3 className="text-lg font-display text-ink-900 mb-1">Your cart is empty</h3>
                <p className="text-sm text-ink-700 mb-6">
                  Add some premium gadgets to your cart to get started.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-brand-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-orange-light transition-colors shadow-premium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                  const finalPrice = item.price + (item.selectedVariant?.priceDiff || 0);
                  return (
                    <div key={item.id} className="flex py-2 border-b border-border/50 pb-4">
                      {/* Product Thumbnail */}
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-surface-alt relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-semibold text-ink-900">
                            <h3 className="line-clamp-1 hover:text-brand-orange">
                              <Link href={`/product/${item.slug}`} onClick={() => setIsOpen(false)}>
                                {item.name}
                              </Link>
                            </h3>
                            <p className="ml-2 font-display">{formatPrice(finalPrice * item.quantity)}</p>
                          </div>
                          {item.selectedVariant && (
                            <p className="mt-1 text-xs text-ink-700 font-medium">
                              {item.selectedVariant.name}: {item.selectedVariant.value}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-1 flex items-end justify-between text-sm">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-border rounded-lg bg-surface-alt overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-ink-700 hover:text-brand-orange hover:bg-border/30 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 py-1 font-semibold text-ink-900 text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-ink-700 hover:text-brand-orange hover:bg-border/30 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1 text-xs font-medium text-error hover:text-red-700 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer details & CTAs */}
          {mounted && items.length > 0 && (
            <div className="border-t border-border px-6 py-6 bg-surface-alt">
              <div className="flex justify-between text-base font-semibold text-ink-900 mb-2">
                <span>Subtotal</span>
                <span className="text-xl font-display text-brand-orange font-bold">
                  {formatPrice(getSubtotal())}
                </span>
              </div>
              <p className="text-xs text-ink-700 mb-6">
                Shipping fees calculated at checkout. Deliveries across Nigeria.
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center px-6 py-3.5 border border-transparent rounded-lg shadow-premium text-base font-medium text-white bg-brand-orange hover:bg-brand-orange-light transition-all duration-200 text-center"
                >
                  Proceed to Checkout
                </Link>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center px-6 py-3.5 border border-border rounded-lg bg-surface text-ink-900 hover:bg-surface-alt transition-all duration-200 text-sm font-semibold text-center"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

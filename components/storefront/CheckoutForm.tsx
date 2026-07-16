"use client";

import React, { useState, useEffect } from "react";
import { useCartStore, CartItem } from "@/lib/cartStore";
import { createOrder } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";
import { ShoppingBag, ChevronRight, Loader2, ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Nigerian States List
const NIGERIAN_STATES = [
  "Lagos", "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateate",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

// Delivery fee mapping in kobo
const LAGOS_MAINLAND_FEE = 250000;
const LAGOS_ISLAND_FEE = 400000;
const OUTSIDE_LAGOS_FEE = 650000;

export default function CheckoutForm() {
  const router = useRouter();
  const { items, getSubtotal, clearCart, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Sync / Hydrate Zustand store
  useEffect(() => {
    setMounted(true);
    useCartStore.persist.rehydrate();
  }, []);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [lga, setLga] = useState("");
  
  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; type: string; value: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Process State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!mounted) return null;

  // Cart summary metrics (in kobo)
  const cartSubtotal = getSubtotal();

  // Dynamic Shipping Calculation (Matches Backend)
  const getDeliveryFee = () => {
    if (!selectedState) return 0;
    if (selectedState.toLowerCase() === "lagos") {
      const lowerLga = lga.toLowerCase();
      if (
        lowerLga.includes("lekki") ||
        lowerLga.includes("ikoyi") ||
        lowerLga.includes("victoria island") ||
        lowerLga.includes("island") ||
        lowerLga.includes("eti-osa")
      ) {
        return LAGOS_ISLAND_FEE;
      }
      return LAGOS_MAINLAND_FEE;
    }
    return OUTSIDE_LAGOS_FEE;
  };

  const deliveryFee = getDeliveryFee();

  // Coupon application logic (checking welcome codes)
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const code = couponInput.trim().toUpperCase();
    if (code === "YANKEE5") {
      setActiveCoupon({ code: "YANKEE5", type: "percent", value: 5 });
    } else if (code === "WELCOME10K") {
      setActiveCoupon({ code: "WELCOME10K", type: "fixed", value: 1000000 }); // ₦10,000 in kobo
    } else {
      setCouponError("Invalid or expired coupon code.");
    }
  };

  const getDiscountAmount = () => {
    if (!activeCoupon) return 0;
    if (activeCoupon.type === "percent") {
      return Math.round((cartSubtotal * activeCoupon.value) / 100);
    }
    return activeCoupon.value;
  };

  const discount = getDiscountAmount();
  const finalTotal = Math.max(0, cartSubtotal - discount) + deliveryFee;

  // Format helper
  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!fullName || !email || !phone || !streetAddress || !selectedState || !lga) {
      setError("Please fill in all required shipping and contact details.");
      setLoading(false);
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty. Please add products before checking out.");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        fullName,
        email,
        phone,
        streetAddress,
        state: selectedState,
        lga,
        couponCode: activeCoupon?.code || undefined,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant,
        })),
      };

      const res = await createOrder(orderData);

      if (res.success) {
        // Order created successfully. Redirect to Success Page
        clearCart();
        router.push(`/checkout/success?orderNumber=${res.orderNumber}`);
      } else {
        setError(res.error || "Failed to create order. Please try again.");
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center py-20 px-4">
        <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-ink-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-ink-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-ink-700 mb-6">
          You need items in your cart to checkout. Browse our premium store catalog!
        </p>
        <Link
          href="/shop"
          className="bg-brand-orange text-white hover:bg-brand-orange-light px-6 py-3 rounded-lg text-sm font-semibold inline-block transition-colors shadow-premium"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Checkout Form (Left Column) */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-border">
        <h2 className="text-xl font-display font-bold text-ink-900 mb-6 pb-2 border-b border-border">
          Shipping & Contact Details
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error text-sm rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              required
              placeholder="e.g. John Obi"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="e.g. email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                required
                placeholder="e.g. +234 903 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label htmlFor="streetAddress" className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Street Address *
            </label>
            <textarea
              id="streetAddress"
              required
              rows={3}
              placeholder="e.g. Suite 5, 2A Olaide Tomori St, Ikeja, Lagos"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State Selection */}
            <div>
              <label htmlFor="state" className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                State *
              </label>
              <select
                id="state"
                required
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  // Clear LGA if state changes to trigger re-calculation
                  setLga("");
                }}
                className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg focus:bg-white"
              >
                <option value="">Select State</option>
                {NIGERIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* LGA / Area */}
            <div>
              <label htmlFor="lga" className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Local Government Area (LGA) *
              </label>
              <input
                type="text"
                id="lga"
                required
                placeholder="e.g. Ikeja, Lekki Phase 1"
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
              />
              {selectedState.toLowerCase() === "lagos" && (
                <span className="text-[10px] text-ink-700 mt-1 block">
                  Island LGAs: Lekki, Ikoyi, VI, Eti-Osa, Island. Others Mainland.
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-brand-orange hover:bg-brand-orange-light text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-premium hover:shadow-premium-hover transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>Place Order & Pay {formatPrice(finalTotal)}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Summary (Right Column) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Cart Item Details */}
        <div className="bg-white p-6 rounded-xl border border-border">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
            <h3 className="font-display font-bold text-ink-900">
              Order Summary
            </h3>
            <span className="text-xs bg-surface-alt text-ink-900 px-2 py-0.5 rounded-full font-semibold">
              {getItemCount()} items
            </span>
          </div>

          <div className="divide-y divide-border/40 max-h-60 overflow-y-auto pr-1 no-scrollbar mb-4">
            {items.map((item) => {
              const finalItemPrice = item.price + (item.selectedVariant?.priceDiff || 0);
              return (
                <div key={item.id} className="flex py-3 items-center gap-3">
                  <div className="relative w-12 h-12 rounded bg-surface-alt border border-border shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-ink-900 truncate">
                      {item.name}
                    </h4>
                    {item.selectedVariant && (
                      <p className="text-[10px] text-ink-700 font-medium">
                        {item.selectedVariant.name}: {item.selectedVariant.value}
                      </p>
                    )}
                    <span className="text-xs text-ink-700">
                      Qty: {item.quantity} × {formatPrice(finalItemPrice)}
                    </span>
                  </div>
                  <span className="text-sm font-bold font-display text-ink-900">
                    {formatPrice(finalItemPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-6 border-t border-border/40 pt-4">
            <div className="relative flex-1">
              <Ticket className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="w-full bg-surface-alt border border-border text-sm pl-9 pr-3 py-2 rounded-lg placeholder-ink-400"
              />
            </div>
            <button
              type="submit"
              className="bg-ink-900 hover:bg-ink-700 text-white text-xs font-bold uppercase tracking-wider px-4 rounded-lg transition-colors"
            >
              Apply
            </button>
          </form>

          {couponError && <p className="text-xs text-error font-medium mb-4">{couponError}</p>}
          {activeCoupon && (
            <div className="flex items-center justify-between text-xs bg-green-50 text-green-700 p-2.5 rounded-lg mb-4 font-semibold border border-green-200">
              <span>Coupon applied: {activeCoupon.code}</span>
              <button
                type="button"
                onClick={() => {
                  setActiveCoupon(null);
                  setCouponInput("");
                }}
                className="text-green-800 hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          {/* Detailed Calculations */}
          <div className="space-y-3 text-sm text-ink-700 border-t border-border/40 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-display font-medium text-ink-900">{formatPrice(cartSubtotal)}</span>
            </div>

            {activeCoupon && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount ({activeCoupon.code})</span>
                <span className="font-display">- {formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-display font-medium text-ink-900">
                {selectedState ? formatPrice(deliveryFee) : "Select state..."}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-ink-900 border-t border-border/40 pt-3">
              <span>Total Amount</span>
              <span className="text-xl font-display text-brand-orange font-black">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-brand-orange-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modify Cart / Shop</span>
        </Link>
      </div>

    </div>
  );
}

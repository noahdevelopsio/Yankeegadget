import React from "react";
import CheckoutForm from "@/components/storefront/CheckoutForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Yankee Gadgets",
  description: "Review your shopping cart, fill in delivery details, and securely checkout at Yankee Gadgets.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-surface-alt min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8 px-2 sm:px-0">
          <h1 className="text-3xl font-display font-black text-ink-900">
            Secure Checkout
          </h1>
          <p className="text-sm text-ink-700 mt-1">
            Fill in your delivery details below to finalize your gadget order.
          </p>
        </div>

        {/* Client form */}
        <CheckoutForm />

      </div>
    </div>
  );
}

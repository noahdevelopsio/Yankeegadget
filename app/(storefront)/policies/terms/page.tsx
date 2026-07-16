import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Yankee Gadgets",
  description: "Read through our store terms of service, product listings warranty, and purchase regulations.",
};

export default function TermsPage() {
  return (
    <article className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-ink-900 border-b border-border pb-2">
        Terms & Conditions
      </h2>
      <p className="text-sm text-ink-700 leading-relaxed">
        Last updated: July 16, 2026
      </p>

      <p className="text-sm text-ink-700 leading-relaxed">
        Welcome to Yankee Gadgets! These terms and conditions outline the rules and regulations for the use of Yankee Gadgets' Website, located at yankeegadgets.ng.
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">1. Purchasing & Payments</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        By placing an order on our storefront, you verify that you are authorized to use the specified credit card or bank account. All order prices listed are in Nigerian Naira (₦). Payments are processed securely via Flutterwave and orders are confirmed once verified.
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">2. Stock Availability & Errors</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        We strive to maintain exact inventory levels. In the rare event that a product is out of stock after order creation, we will notify you immediately to process a replacement product or issue a full refund.
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">3. Content Intellectual Property</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        Unless otherwise stated, Yankee Gadgets owns the intellectual property rights for all material, logo designs, icons, and media displayed on yankeegadgets.ng. All intellectual property rights are reserved.
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">4. Governing Law</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        These Terms shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Nigeria for the resolution of any disputes.
      </p>
    </article>
  );
}

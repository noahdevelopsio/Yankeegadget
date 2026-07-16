import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy | Yankee Gadgets",
  description: "Read about our gadget warranties, refund guidelines, and product return timelines.",
};

export default function RefundPolicyPage() {
  return (
    <article className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-ink-900 border-b border-border pb-2">
        Refund & Return Policy
      </h2>
      <p className="text-sm text-ink-700 leading-relaxed">
        Last updated: July 16, 2026
      </p>

      <p className="text-sm text-ink-700 leading-relaxed">
        At Yankee Gadgets, customer satisfaction is our top priority. We offer testing windows and return warranties on our premium electronics:
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">1. Return Window</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        We offer a 7-day return policy for any products that show manufacturer defects from the date of purchase. To be eligible for a return, the product must be in its original packaging, unused, and include all accessories, manuals, and free gifts.
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">2. Defective Items (Warranty)</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        All smartphones and consoles include a standard supplier warranty (detailed on your receipt). If a manufacturer defect is verified within the warranty window, we will repair the item, provide a replacement, or issue a refund if a replacement is unavailable.
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">3. Exceptions & Non-Returnable Items</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        Certain items are not eligible for returns:
      </p>
      <ul className="list-disc list-inside text-sm text-ink-700 pl-4 space-y-1">
        <li>Physical liquid or drop damage caused by user accident.</li>
        <li>Software locks, modified operating systems, or bricked devices.</li>
        <li>Opened hygiene products like in-ear earbuds (unless defective on arrival).</li>
      </ul>

      <h3 className="text-lg font-bold text-ink-900 mt-6">4. How to Initiate a Return</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        To request a return or report a defect, please contact us on WhatsApp at +234 903 703 6463 or email support@yankeegadgets.ng with your order reference number and a video showing the defect.
      </p>
    </article>
  );
}

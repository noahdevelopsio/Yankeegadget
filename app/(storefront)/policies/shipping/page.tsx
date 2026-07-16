import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Yankee Gadgets",
  description: "Review our shipping rates, delivery zones, same-day delivery timelines, and nationwide dispatch fees.",
};

export default function ShippingPolicyPage() {
  return (
    <article className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-ink-900 border-b border-border pb-2">
        Shipping Policy
      </h2>
      <p className="text-sm text-ink-700 leading-relaxed">
        Last updated: July 16, 2026
      </p>

      <p className="text-sm text-ink-700 leading-relaxed">
        We are committed to delivering your premium gadgets quickly and safely. Below are the delivery zones, pricing systems, and arrival timelines configured for Yankee Gadgets shipments:
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">1. Delivery Zones & Fees</h3>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-left text-sm border-collapse border border-border">
          <thead>
            <tr className="bg-surface-alt font-bold border-b border-border">
              <th className="p-3">Shipping Zone</th>
              <th className="p-3">Delivery Fee</th>
              <th className="p-3">Estimated Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-3 font-semibold text-ink-900">Lagos Mainland</td>
              <td className="p-3 text-brand-orange font-bold">₦2,500</td>
              <td className="p-3 text-ink-700">24 to 48 Hours</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-ink-900">Lagos Island</td>
              <td className="p-3 text-brand-orange font-bold">₦4,000</td>
              <td className="p-3 text-ink-700">24 to 48 Hours</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-ink-900">Outside Lagos (Nationwide)</td>
              <td className="p-3 text-brand-orange font-bold">₦6,500</td>
              <td className="p-3 text-ink-700">3 to 5 Business Days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-bold text-ink-900 mt-6">2. Same-Day Dispatch</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        For orders placed within Lagos before 12:00 PM (Monday to Saturday), same-day dispatch is optional. Orders placed after 12:00 PM will be processed and dispatched the following business day.
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">3. Delivery Procedures</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        Our dispatch riders will contact the phone number provided at checkout before arriving at the location. Please make sure the number is reachable. If we cannot reach you, the package will be held and delivery rescheduled.
      </p>
    </article>
  );
}

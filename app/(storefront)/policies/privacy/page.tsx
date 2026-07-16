import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Yankee Gadgets",
  description: "Learn about how Yankee Gadgets collects, processes, and protects your personal shopping data.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-ink-900 border-b border-border pb-2">
        Privacy Policy
      </h2>
      <p className="text-sm text-ink-700 leading-relaxed">
        Last updated: July 16, 2026
      </p>
      
      <p className="text-sm text-ink-700 leading-relaxed">
        At Yankee Gadgets, accessible from yankeegadgets.ng, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Yankee Gadgets and how we use it.
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">1. Information We Collect</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        When you place an order, we collect details necessary to process shipments, including your full name, email address, phone number, physical shipping address, state, and Local Government Area (LGA). We do not store credit card credentials; all financial payments are securely processed by Flutterwave.
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">2. How We Use Your Information</h3>
      <p className="text-sm text-ink-700 leading-relaxed font-normal">
        We utilize the collected details to:
      </p>
      <ul className="list-disc list-inside text-sm text-ink-700 pl-4 space-y-1">
        <li>Fulfill, dispatch, and track your purchased gadgets.</li>
        <li>Send order receipts, invoices, and confirmation alerts.</li>
        <li>Communicate delivery status updates via email or phone.</li>
        <li>Improve our store experience and prevent fraud.</li>
      </ul>

      <h3 className="text-lg font-bold text-ink-900 mt-6">3. Security</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        We value your trust in providing us your personal information, thus we are striving to use commercially acceptable means of protecting it. All data communication is encrypted over HTTPS (Secure Socket Layer).
      </p>

      <h3 className="text-lg font-bold text-ink-900 mt-6">4. Contact Us</h3>
      <p className="text-sm text-ink-700 leading-relaxed">
        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at support@yankeegadgets.ng.
      </p>
    </article>
  );
}

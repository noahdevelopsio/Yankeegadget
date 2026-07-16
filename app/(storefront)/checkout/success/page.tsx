import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { CheckCircle2, MessageCircle, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Yankee Gadgets",
  description: "Your order has been placed successfully. Thank you for shopping with Yankee Gadgets.",
};

interface SuccessPageProps {
  searchParams: {
    orderNumber?: string;
  };
}

async function getOrderDetails(orderNumber: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return { order, dbConnected: true };
  } catch (error) {
    console.warn("Database connection failed, serving dynamic mockup order on success page:", error);
    return { order: null, dbConnected: false };
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const orderNumber = searchParams.orderNumber || "YG-MOCK-ORDER";
  const { order, dbConnected } = await getOrderDetails(orderNumber);

  // Format helper
  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  // WhatsApp confirm link details
  const whatsappPhone = "2349037036463";
  const whatsappMsg = encodeURIComponent(
    `Hello Yankee Gadgets! I just placed order ${orderNumber} on your website. Here are my details to confirm delivery.`
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMsg}`;

  // Estimate delivery time based on selected region
  const getDeliveryEstimate = (state: string) => {
    if (!state) return "2-4 Business Days";
    if (state.toLowerCase().includes("lagos")) {
      return "24 to 48 Hours (Same-Day Delivery optional)";
    }
    return "3 to 5 Business Days (Nationwide Dispatch)";
  };

  return (
    <div className="bg-surface-alt min-h-screen py-16 px-4">
      <div className="mx-auto max-w-2xl bg-white rounded-2xl border border-border p-6 sm:p-10 shadow-premium text-center">
        
        {/* Animated Checkmark Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-6 border border-green-200">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-display font-black text-ink-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-ink-700 max-w-md mx-auto mb-6">
          Thank you for choosing Yankee Gadgets. Your order details have been saved, and our riders are preparing package dispatch.
        </p>

        {/* Order Reference Card */}
        <div className="bg-surface-alt rounded-xl p-5 border border-border text-left mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between border-b border-border/60 pb-3 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Order Reference</span>
              <p className="text-base font-bold font-display text-ink-900">{orderNumber}</p>
            </div>
            {order && (
              <div className="sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Payment Status</span>
                <p className="text-sm font-bold text-warning uppercase">PENDING PAYMENT</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-ink-700">
            {/* Delivery address */}
            <div className="space-y-1">
              <span className="font-bold text-ink-900 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                Shipping To
              </span>
              <p className="font-medium text-ink-900 mt-1">
                {order ? order.deliveryAddress : "Your Specified Street Address"}
              </p>
              <p>
                {order ? `${order.deliveryLga}, ${order.deliveryState}` : "Lagos, Nigeria"}
              </p>
            </div>

            {/* Delivery Time Estimation */}
            <div className="space-y-1">
              <span className="font-bold text-ink-900 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                Estimated Arrival
              </span>
              <p className="font-semibold text-ink-900 mt-1">
                {getDeliveryEstimate(order ? order.deliveryState : "Lagos")}
              </p>
              <p className="text-[10px] text-ink-400">
                Dispatch notifications will be sent to your email.
              </p>
            </div>
          </div>

          {order && (
            <div className="border-t border-border/60 pt-3 flex justify-between items-center text-sm font-bold text-ink-900">
              <span>Total Amount Paid/Pending</span>
              <span className="text-base font-display text-brand-orange font-black">
                {formatPrice(order.total)}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-premium"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
            <span>Confirm via WhatsApp</span>
          </a>

          <Link
            href="/shop"
            className="w-full sm:w-auto flex items-center justify-center border border-border bg-white text-ink-900 hover:bg-surface-alt px-8 py-3.5 rounded-xl font-bold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support contacts */}
        <div className="mt-10 pt-8 border-t border-border/60 flex flex-wrap justify-center gap-6 text-xs text-ink-700">
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-ink-400" />
            +234 807 308 3426
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-ink-400" />
            support@yankeegadgets.ng
          </span>
        </div>

      </div>
    </div>
  );
}

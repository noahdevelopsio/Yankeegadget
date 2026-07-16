import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusSelector from "./OrderStatusSelector"; // client selector
import { MapPin, Mail, Phone, Calendar, ArrowLeft, Shield } from "lucide-react";
import Image from "next/image";

// Mock Fallback
async function getOrderDetail(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });
  } catch (error) {
    console.error("Database connection failed on order details:", error);
    return null;
  }
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderDetail(params.id);

  if (!order) {
    return notFound();
  }

  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  const payment = (order as any).payment;

  return (
    <div className="space-y-6">
      
      {/* Back button and breadcrumbs */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-brand-orange-light transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders List</span>
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-black text-ink-900">
              Order {order.orderNumber}
            </h1>
            <p className="text-xs text-ink-400 mt-1">
              Logged on {new Date(order.createdAt).toLocaleString("en-NG")}
            </p>
          </div>
          {/* Status Changer (Client dropdown component) */}
          <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Items Ordered & Financial details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Items Summary card */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-premium space-y-4">
            <h3 className="font-display font-bold text-ink-900 border-b border-border pb-2 text-base">
              Ordered Gadgets
            </h3>
            <div className="divide-y divide-border/40">
              {order.items.map((item: any) => {
                const variant = item.variantInfo ? JSON.parse(item.variantInfo) : null;
                return (
                  <div key={item.id} className="flex py-4 items-center gap-4">
                    <div className="relative w-16 h-16 rounded bg-surface-alt border border-border overflow-hidden shrink-0">
                      {item.product.image && (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-ink-900 truncate">
                        {item.product.name}
                      </h4>
                      {variant && (
                        <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider">
                          {variant.name}: {variant.value}
                        </p>
                      )}
                      <span className="text-xs text-ink-700">
                        Quantity: {item.quantity} × {formatPrice(item.unitPrice)}
                      </span>
                    </div>
                    <span className="font-bold text-ink-900 text-sm shrink-0">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing calculations details */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-premium space-y-3">
            <h3 className="font-display font-bold text-ink-900 border-b border-border pb-2 text-base">
              Order Financials
            </h3>
            <div className="space-y-2 text-sm text-ink-700">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-ink-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Delivery Fee</span>
                <span className="font-semibold text-ink-900">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-ink-900 border-t border-border/40 pt-3">
                <span>Grand Total Receipt</span>
                <span className="text-lg font-display text-brand-orange font-black">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Customer Shipping Details & Payment Log */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Shipping detail card */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-premium space-y-4">
            <h3 className="font-display font-bold text-ink-900 border-b border-border pb-2 text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>Recipient Shipping</span>
            </h3>
            <div className="text-sm space-y-3">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">Street Address</span>
                <p className="font-medium text-ink-900 mt-0.5">{order.deliveryAddress}</p>
                <p className="text-ink-700">{order.deliveryLga}, {order.deliveryState} State</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-ink-700 pt-2 border-t border-border/40">
                <Mail className="w-4 h-4 text-ink-400" />
                <span>{order.guestEmail || "No guest email"}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-ink-700">
                <Phone className="w-4 h-4 text-ink-400" />
                <span>{order.guestPhone || "No guest phone"}</span>
              </div>
            </div>
          </div>

          {/* Payment gateway card */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-premium space-y-4">
            <h3 className="font-display font-bold text-ink-900 border-b border-border pb-2 text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-orange" />
              <span>Payment Details</span>
            </h3>
            {payment ? (
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Status</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    payment.status === "SUCCESSFUL"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-amber-50 border-amber-200 text-warning"
                  }`}>
                    {payment.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">Gateway Ref</span>
                  <p className="font-mono text-xs text-ink-900 truncate" title={payment.flutterwaveTxRef}>
                    {payment.flutterwaveTxRef}
                  </p>
                </div>
                {payment.flutterwaveTxId && (
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-400">Transaction ID</span>
                    <p className="font-mono text-xs text-ink-900">
                      {payment.flutterwaveTxId}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-ink-400">No payment transaction records registered.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

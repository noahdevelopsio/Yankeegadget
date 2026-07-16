import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ClipboardList, ChevronRight } from "lucide-react";

async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { orders };
  } catch (error) {
    console.error("Database connection failed on Orders List:", error);
    return { orders: [] };
  }
}

export default async function AdminOrdersPage() {
  const { orders } = await getOrders();

  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-display font-black text-ink-900">
          Sales Orders
        </h1>
        <p className="text-sm text-ink-700 mt-1">
          Review checkout receipts, manage shipment tracking, and process dispatches
        </p>
      </div>

      {/* Orders Table list */}
      <div className="bg-white rounded-xl border border-border shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-surface-alt/50 text-ink-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="px-6 py-4">Order Number</th>
                <th className="px-6 py-4">Guest Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {orders.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-surface-alt/25 transition-colors">
                  <td className="px-6 py-4 font-semibold text-ink-900 font-mono text-sm">
                    {ord.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-ink-700">{ord.guestEmail || "N/A"}</td>
                  <td className="px-6 py-4 text-ink-700 font-mono text-xs">{ord.guestPhone || "N/A"}</td>
                  <td className="px-6 py-4 text-ink-700">{ord.deliveryState || "N/A"}</td>
                  <td className="px-6 py-4 font-bold font-display text-ink-900">{formatPrice(ord.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                      ord.status === "PAID" || ord.status === "DELIVERED"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : ord.status === "PENDING"
                        ? "bg-amber-50 border-amber-200 text-warning"
                        : "bg-blue-50 border-blue-200 text-blue-700"
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-ink-400">
                    {new Date(ord.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-light uppercase tracking-wider transition-colors"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-ink-700">
                    No checkout orders registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

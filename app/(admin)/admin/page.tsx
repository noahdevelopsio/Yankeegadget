import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CreditCard, ShoppingBag, AlertTriangle, TrendingUp, ArrowRight, User } from "lucide-react";

// Mock fallbacks in case of DB connection issues
const MOCK_METRICS = {
  totalRevenue: 345000000, // ₦3,450,000 in kobo
  pendingPayments: 72500000, // ₦725,000 in kobo
  orderCount: 15,
  lowStockCount: 2,
};

const MOCK_RECENT_ORDERS = [
  { id: "o1", orderNumber: "YG-782103-M1", guestEmail: "obi@example.com", total: 64000000, status: "PENDING", createdAt: new Date() },
  { id: "o2", orderNumber: "YG-623912-M2", guestEmail: "shade@example.com", total: 185000000, status: "PAID", createdAt: new Date(Date.now() - 3600000) },
  { id: "o3", orderNumber: "YG-512039-M3", guestEmail: "chinedu@example.com", total: 32000000, status: "DELIVERED", createdAt: new Date(Date.now() - 86400000) },
];

const MOCK_LOW_STOCK_PRODUCTS = [
  { id: "p1", name: "PlayStation 5 Disc Edition", sku: "SN-PS5-DISC", stock: 2, price: 72000000 },
  { id: "p2", name: "Sony WF-1000XM5 Wireless Earbuds", sku: "SN-WF1000XM5", stock: 3, price: 25000000 },
];

async function getDashboardMetrics() {
  try {
    const totalOrdersCount = await prisma.order.count();
    
    // Revenue (Sum of PAID, PROCESSING, SHIPPED, DELIVERED orders)
    const revenueSum = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
      },
    });

    // Pending Payments
    const pendingSum = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "PENDING",
      },
    });

    const lowStockCount = await prisma.product.count({
      where: {
        stock: {
          lte: 3,
        },
      },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 3,
        },
      },
      take: 5,
    });

    return {
      metrics: {
        totalRevenue: revenueSum._sum.total || 0,
        pendingPayments: pendingSum._sum.total || 0,
        orderCount: totalOrdersCount,
        lowStockCount,
      },
      recentOrders: recentOrders.length > 0 ? recentOrders : MOCK_RECENT_ORDERS,
      lowStockProducts: lowStockProducts.length > 0 ? lowStockProducts : MOCK_LOW_STOCK_PRODUCTS,
      dbConnected: true,
    };
  } catch (error) {
    console.warn("Database connection failed, serving mock dashboard data:", error);
    return {
      metrics: MOCK_METRICS,
      recentOrders: MOCK_RECENT_ORDERS,
      lowStockProducts: MOCK_LOW_STOCK_PRODUCTS,
      dbConnected: false,
    };
  }
}

export default async function AdminDashboardPage() {
  const { metrics, recentOrders, lowStockProducts, dbConnected } = await getDashboardMetrics();

  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  return (
    <div className="space-y-8">
      {/* DB Connection Alert for development */}
      {!dbConnected && (
        <div className="bg-warning/15 text-warning text-xs font-semibold py-2.5 px-4 rounded-lg border border-warning/20">
          ⚠️ Serving dashboard mock metrics. Configure your postgres instance URL inside `.env` to pull live data.
        </div>
      )}

      {/* Metrics Row Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-border flex items-center justify-between shadow-premium">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Total Revenue</span>
            <p className="text-2xl font-bold font-display text-ink-900 mt-1">{formatPrice(metrics.totalRevenue)}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-6 rounded-xl border border-border flex items-center justify-between shadow-premium">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Pending Payments</span>
            <p className="text-2xl font-bold font-display text-ink-900 mt-1">{formatPrice(metrics.pendingPayments)}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-warning flex items-center justify-center border border-amber-200">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Order Count */}
        <div className="bg-white p-6 rounded-xl border border-border flex items-center justify-between shadow-premium">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Total Orders</span>
            <p className="text-2xl font-bold font-display text-ink-900 mt-1">{metrics.orderCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="bg-white p-6 rounded-xl border border-border flex items-center justify-between shadow-premium">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Low Stock Items</span>
            <p className="text-2xl font-bold font-display text-ink-900 mt-1">{metrics.lowStockCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 text-error flex items-center justify-center border border-red-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders List (Left) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-border shadow-premium space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="font-display font-bold text-ink-900 text-lg">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="group flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-light tracking-wide uppercase transition-colors"
            >
              <span>Manage Orders</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-ink-400 uppercase text-[10px] tracking-wider font-bold">
                  <th className="pb-3">Order Ref</th>
                  <th className="pb-3">Customer Email</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="py-3 font-semibold text-ink-900">
                      <Link href={`/admin/orders/${ord.id}`} className="hover:text-brand-orange hover:underline">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-ink-700">{ord.guestEmail || "Guest User"}</td>
                    <td className="py-3 font-bold font-display text-ink-900">{formatPrice(ord.total)}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        ord.status === "PAID" || ord.status === "DELIVERED"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : ord.status === "PENDING"
                          ? "bg-amber-50 border-amber-200 text-warning"
                          : "bg-blue-50 border-blue-200 text-blue-700"
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-ink-400 text-xs">
                      {new Date(ord.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (Right) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-border shadow-premium space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="font-display font-bold text-ink-900 text-lg">
              Low Stock Warnings
            </h3>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-brand-orange hover:text-brand-orange-light tracking-wide uppercase transition-colors"
            >
              Restock
            </Link>
          </div>

          <div className="space-y-4">
            {lowStockProducts.map((prod: any) => (
              <div key={prod.id} className="flex justify-between items-center p-3 rounded-lg bg-red-50/50 border border-red-200/40">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-ink-900 truncate">
                    {prod.name}
                  </h4>
                  <span className="text-[10px] text-ink-400 font-medium block">
                    SKU: {prod.sku || "N/A"}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold bg-error text-white px-2 py-0.5 rounded-full">
                    {prod.stock} left
                  </span>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-sm text-ink-700 text-center py-6">
                All catalog inventories are fully stocked!
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

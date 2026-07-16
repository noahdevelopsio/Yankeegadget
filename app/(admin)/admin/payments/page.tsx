import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import PaymentActions from "./PaymentActions"; // client actions

async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { payments };
  } catch (error) {
    console.error("Database connection failed on Payments List:", error);
    return { payments: [] };
  }
}

export default async function AdminPaymentsPage() {
  const { payments } = await getPayments();

  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-display font-black text-ink-900">
          Payment Transactions
        </h1>
        <p className="text-sm text-ink-700 mt-1">
          Monitor incoming online transactions and manually approve bank transfers
        </p>
      </div>

      {/* Payments Log list */}
      <div className="bg-white rounded-xl border border-border shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-surface-alt/50 text-ink-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="px-6 py-4">Order Ref</th>
                <th className="px-6 py-4">Flutterwave Ref</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {payments.map((pay: any) => (
                <tr key={pay.id} className="hover:bg-surface-alt/25 transition-colors">
                  <td className="px-6 py-4 font-semibold text-ink-900">
                    {pay.order?.orderNumber || "Deleted Order"}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-ink-400">{pay.flutterwaveTxRef}</td>
                  <td className="px-6 py-4 font-mono text-xs text-ink-700">
                    {pay.flutterwaveTxId || "—"}
                  </td>
                  <td className="px-6 py-4 font-bold font-display text-ink-900">{formatPrice(pay.amount)}</td>
                  <td className="px-6 py-4 text-ink-700 text-xs uppercase font-medium">
                    {pay.channel || "Pending"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      pay.status === "SUCCESSFUL"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : pay.status === "FAILED"
                        ? "bg-red-50 border-red-200 text-error"
                        : "bg-amber-50 border-amber-200 text-warning"
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-ink-400">
                    {new Date(pay.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <PaymentActions id={pay.id} status={pay.status} />
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-ink-700">
                    No payment logs recorded.
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

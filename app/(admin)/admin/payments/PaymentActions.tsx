"use client";

import React, { useState } from "react";
import { manuallyConfirmPayment } from "@/app/actions/admin";
import { Loader2 } from "lucide-react";

interface PaymentActionsProps {
  id: string;
  status: string;
}

export default function PaymentActions({ id, status }: PaymentActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!confirm("Are you sure you want to manually mark this payment as successful? This will also update the order status to PAID.")) {
      return;
    }
    setLoading(true);
    try {
      const res = await manuallyConfirmPayment(id);
      if (!res.success) {
        alert(res.error || "Failed to confirm payment.");
      }
    } catch (err) {
      alert("Connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status !== "PENDING") {
    return <span className="text-xs text-ink-400 font-semibold">—</span>;
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm"
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Confirming...</span>
        </>
      ) : (
        <span>Mark as Paid</span>
      )}
    </button>
  );
}

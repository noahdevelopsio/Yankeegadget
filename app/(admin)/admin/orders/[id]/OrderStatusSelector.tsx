"use client";

import React, { useState } from "react";
import { updateOrderStatus } from "@/app/actions/admin";
import { Loader2 } from "lucide-react";

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: string;
}

const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderStatusSelector({ orderId, currentStatus }: OrderStatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value;
    setLoading(true);
    try {
      const res = await updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        setStatus(nextStatus);
      } else {
        alert(res.error || "Failed to update order status.");
        // reset to original
        setStatus(status);
      }
    } catch (err) {
      alert("Connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />}
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className="bg-white border border-border text-sm font-semibold px-3 py-2 rounded-lg text-ink-900 focus:border-brand-orange/50 transition-colors shadow-sm cursor-pointer"
      >
        {ORDER_STATUSES.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PriceFilterFormProps {
  initialMinPrice: string;
  initialMaxPrice: string;
}

export default function PriceFilterForm({ initialMinPrice, initialMaxPrice }: PriceFilterFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  // Keep state synced with URL changes
  useEffect(() => {
    setMinPrice(initialMinPrice);
  }, [initialMinPrice]);

  useEffect(() => {
    setMaxPrice(initialMaxPrice);
  }, [initialMaxPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice.trim()) {
      params.set("minPrice", minPrice.trim());
    } else {
      params.delete("minPrice");
    }

    if (maxPrice.trim()) {
      params.set("maxPrice", maxPrice.trim());
    } else {
      params.delete("maxPrice");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="minPrice" className="sr-only">Min Price</label>
          <input
            type="number"
            id="minPrice"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-surface-alt border border-border text-sm px-3 py-2 rounded-lg placeholder-ink-400 focus:outline-none focus:border-brand-orange/40"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="sr-only">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-surface-alt border border-border text-sm px-3 py-2 rounded-lg placeholder-ink-400 focus:outline-none focus:border-brand-orange/40"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-ink-900 text-white hover:bg-ink-700 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
      >
        Apply Range
      </button>
    </form>
  );
}

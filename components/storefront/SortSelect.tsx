"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SortSelectProps {
  currentSort: string;
}

export default function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", val);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      id="sort"
      value={currentSort || "newest"}
      onChange={(e) => handleSortChange(e.target.value)}
      className="bg-surface-alt border border-border text-ink-900 text-sm px-3 py-2 rounded-lg cursor-pointer focus:border-brand-orange/40 focus:outline-none"
    >
      <option value="newest">Newest Arrivals</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}

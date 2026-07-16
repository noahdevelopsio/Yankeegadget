"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: { url: string; altText: string | null }[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const fallbackImage = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop";
  const mainImage = images?.[activeIdx]?.url || fallbackImage;
  const mainAlt = images?.[activeIdx]?.altText || "Product Image";

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full rounded-xl bg-surface-alt border border-border overflow-hidden">
        <Image
          src={fallbackImage}
          alt="Placeholder"
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Display Image */}
      <div className="relative aspect-square w-full rounded-xl bg-surface-alt border border-border overflow-hidden shadow-premium">
        <Image
          src={mainImage}
          alt={mainAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 transition-all duration-300"
        />
      </div>

      {/* Thumbnails grid */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1 no-scrollbar">
          {images.map((img, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden bg-surface-alt border transition-all ${
                  isActive
                    ? "border-brand-orange ring-1 ring-brand-orange"
                    : "border-border hover:border-ink-400"
                }`}
                aria-label={`View thumbnail ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `Thumbnail ${idx + 1}`}
                  fill
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

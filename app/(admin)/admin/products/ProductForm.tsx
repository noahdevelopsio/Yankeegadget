"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProduct } from "@/app/actions/admin";
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialProduct?: {
    id: string;
    name: string;
    brand: string;
    sku: string;
    price: number; // in kobo
    compareAtPrice: number | null; // in kobo
    stock: number;
    description: string;
    image: string;
    categoryId: string;
    isPublished: boolean;
    specs: string; // JSON string
    metaTitle: string | null;
    metaDescription: string | null;
  };
}

export default function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Base Form Fields
  const [name, setName] = useState(initialProduct?.name || "");
  const [brand, setBrand] = useState(initialProduct?.brand || "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [price, setPrice] = useState(initialProduct ? String(initialProduct.price / 100) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialProduct?.compareAtPrice ? String(initialProduct.compareAtPrice / 100) : ""
  );
  const [stock, setStock] = useState(initialProduct ? String(initialProduct.stock) : "10");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [image, setImage] = useState(initialProduct?.image || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || "");
  const [isPublished, setIsPublished] = useState(initialProduct ? initialProduct.isPublished : true);

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState(initialProduct?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialProduct?.metaDescription || "");

  // Dynamic Specs Table
  const parseSpecs = () => {
    try {
      if (initialProduct?.specs) {
        const parsed = JSON.parse(initialProduct.specs);
        return Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) }));
      }
    } catch (e) {
      console.warn("Failed to parse specifications JSON:", e);
    }
    return [{ key: "", value: "" }];
  };

  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>(parseSpecs());

  const handleAddSpecRow = () => {
    setSpecsList([...specsList, { key: "", value: "" }]);
  };

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specsList];
    updated[index][field] = val;
    setSpecsList(updated);
  };

  const handleRemoveSpecRow = (index: number) => {
    const updated = [...specsList];
    updated.splice(index, 1);
    setSpecsList(updated);
  };

  // Submit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !price || !categoryId || !image) {
      setError("Please fill in all required fields marked with *");
      setLoading(false);
      return;
    }

    // Convert price inputs from Naira string to Kobo integer
    const priceInKobo = Math.round(parseFloat(price) * 100);
    const compareAtPriceInKobo = compareAtPrice ? Math.round(parseFloat(compareAtPrice) * 100) : undefined;
    const stockInt = parseInt(stock) || 0;

    // Convert specs list array to JSON object
    const specsObject: Record<string, string> = {};
    specsList.forEach((row) => {
      if (row.key.trim() && row.value.trim()) {
        specsObject[row.key.trim()] = row.value.trim();
      }
    });

    try {
      const res = await saveProduct({
        id: initialProduct?.id,
        name,
        brand,
        sku,
        price: priceInKobo,
        compareAtPrice: compareAtPriceInKobo,
        stock: stockInt,
        description,
        image,
        categoryId,
        isPublished,
        specs: JSON.stringify(specsObject),
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
      });

      if (res.success) {
        router.push("/admin/products");
      } else {
        setError(res.error || "Failed to save product details.");
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 bg-error/15 border border-error/20 text-error text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Main product card detail grids */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-premium space-y-6">
        <h3 className="font-display font-bold text-ink-900 border-b border-border pb-2 text-base">
          General Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apple iPad Pro 11-inch M4"
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Brand / Manufacturer
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Apple"
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              SKU Identifier
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. AP-IPAD-M4-11"
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Store Category *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg focus:bg-white cursor-pointer"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Inventory Stock Level *
            </label>
            <input
              type="number"
              required
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg focus:bg-white"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
            Detailed Description
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write description features here..."
            className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Pricing & Media cards */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-premium space-y-6">
        <h3 className="font-display font-bold text-ink-900 border-b border-border pb-2 text-base">
          Pricing & Image
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Price */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Sale Price (₦ Naira) *
            </label>
            <input
              type="number"
              step="any"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1250000"
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
          </div>

          {/* Compare Price */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Original Price (₦ Compare At)
            </label>
            <input
              type="number"
              step="any"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="e.g. 1350000"
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Image URL *
            </label>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/... or /images/products/..."
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
            {image && (
              <div className="mt-3 relative w-32 h-32 rounded-lg border border-border bg-surface-alt overflow-hidden">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specifications Dynamic list card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-premium space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <h3 className="font-display font-bold text-ink-900 text-base">
            Technical Specifications
          </h3>
          <button
            type="button"
            onClick={handleAddSpecRow}
            className="text-xs font-bold text-brand-orange hover:text-brand-orange-light flex items-center gap-1 uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        <div className="space-y-3">
          {specsList.map((row, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Spec Key (e.g. RAM)"
                value={row.key}
                onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                className="flex-1 bg-surface-alt border border-border text-sm px-3 py-2 rounded-lg placeholder-ink-400 focus:bg-white"
              />
              <input
                type="text"
                placeholder="Spec Value (e.g. 16GB)"
                value={row.value}
                onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                className="flex-1 bg-surface-alt border border-border text-sm px-3 py-2 rounded-lg placeholder-ink-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => handleRemoveSpecRow(idx)}
                className="text-error hover:text-red-700 p-2 rounded hover:bg-surface-alt transition-colors"
                title="Remove specification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {specsList.length === 0 && (
            <p className="text-xs text-ink-400 text-center py-4">
              No custom specifications specified. Click Add Row to customize.
            </p>
          )}
        </div>
      </div>

      {/* SEO metadata cards */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-premium space-y-6">
        <h3 className="font-display font-bold text-ink-900 border-b border-border pb-2 text-base">
          SEO & Meta Details
        </h3>

        <div className="grid grid-cols-1 gap-5">
          {/* Meta Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Meta Title Tag
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Keep it around 50-60 characters"
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Meta Description Tag
            </label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Keep it around 150-160 characters"
              className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Save controls */}
      <div className="flex justify-between items-center gap-4 border-t border-border pt-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-brand-orange border-border rounded focus:ring-brand-orange cursor-pointer"
          />
          <label htmlFor="isPublished" className="text-sm font-semibold text-ink-900 cursor-pointer select-none">
            Publish instantly to storefront
          </label>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="border border-border bg-white text-ink-900 hover:bg-surface-alt px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-orange hover:bg-brand-orange-light text-white font-bold px-6 py-3 rounded-lg text-sm flex items-center justify-center gap-1.5 shadow-premium"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <span>Save Product</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import ProductActions from "./ProductActions"; // client side handlers

// Mock fallback list
const MOCK_PRODUCTS = [
  { id: "p1", name: "iPhone 15 Pro Max 256GB", brand: "Apple", sku: "AP-IP15PM-256", price: 185000000, stock: 12, isPublished: true, category: { name: "Phones" } },
  { id: "p2", name: "PlayStation 5 Slim Digital", brand: "Sony", sku: "SN-PS5S-DIG", price: 64000000, stock: 6, isPublished: true, category: { name: "Consoles" } },
];

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { products, dbConnected: true };
  } catch (error) {
    console.warn("Database connection failed, serving mock product lists:", error);
    return { products: MOCK_PRODUCTS, dbConnected: false };
  }
}

export default async function AdminProductsPage() {
  const { products, dbConnected } = await getProducts();

  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  return (
    <div className="space-y-6">
      {!dbConnected && (
        <div className="bg-warning/15 text-warning text-xs font-semibold py-2.5 px-4 rounded-lg border border-warning/20">
          ⚠️ Serving product mock lists. Setup your database to manage live items.
        </div>
      )}

      {/* Header and Add button */}
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-display font-black text-ink-900">
            Catalog Products
          </h1>
          <p className="text-sm text-ink-700 mt-1">
            Displaying {products.length} products in the online store
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-brand-orange hover:bg-brand-orange-light text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-1.5 shadow-premium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl border border-border shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-surface-alt/50 text-ink-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {products.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-surface-alt/25 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-ink-900">{prod.name}</div>
                  </td>
                  <td className="px-6 py-4 text-ink-700">{prod.brand || "N/A"}</td>
                  <td className="px-6 py-4 text-ink-400 font-mono text-xs">{prod.sku || "N/A"}</td>
                  <td className="px-6 py-4 text-ink-700">{prod.category?.name || "N/A"}</td>
                  <td className="px-6 py-4 font-bold font-display text-ink-900">{formatPrice(prod.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${prod.stock <= 3 ? "text-error font-bold" : "text-ink-900"}`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      prod.isPublished
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-ink-400/10 border-border text-ink-400"
                    }`}>
                      {prod.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ProductActions id={prod.id} isPublished={prod.isPublished} />
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-ink-700">
                    No products found in the catalog. Click Add Product to start.
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

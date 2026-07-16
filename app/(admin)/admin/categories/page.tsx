import React from "react";
import prisma from "@/lib/prisma";
import CategoryForm from "./CategoryForm"; // client form
import { FolderTree } from "lucide-react";

// Mock fallbacks
const MOCK_CATEGORIES = [
  { id: "c1", name: "Phones", slug: "phones", _count: { products: 12 } },
  { id: "c2", name: "Earbuds", slug: "earbuds", _count: { products: 8 } },
  { id: "c3", name: "Consoles", slug: "consoles", _count: { products: 4 } },
];

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return { categories, dbConnected: true };
  } catch (error) {
    console.warn("Database connection failed, serving mock categories:", error);
    return { categories: MOCK_CATEGORIES, dbConnected: false };
  }
}

export default async function AdminCategoriesPage() {
  const { categories, dbConnected } = await getCategories();

  return (
    <div className="space-y-6">
      {!dbConnected && (
        <div className="bg-warning/15 text-warning text-xs font-semibold py-2.5 px-4 rounded-lg border border-warning/20">
          ⚠️ Serving mock category list. Configure your database to add live categories.
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-display font-black text-ink-900">
          Product Categories
        </h1>
        <p className="text-sm text-ink-700 mt-1">
          Organize store inventory classifications and dynamic filters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category Creation Form (Left) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-border shadow-premium">
          <h2 className="text-base font-display font-bold text-ink-900 mb-4 pb-2 border-b border-border">
            Create Category
          </h2>
          <CategoryForm />
        </div>

        {/* Categories Table List (Right) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-border shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-surface-alt/50 text-ink-400 uppercase text-[10px] tracking-wider font-bold">
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Slug Identifier</th>
                  <th className="px-6 py-4 text-right">Products Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {categories.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-surface-alt/25 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-brand-orange shrink-0" />
                        <span className="font-semibold text-ink-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-ink-400">/{cat.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs bg-surface-alt text-ink-900 px-2.5 py-1 rounded-full font-bold">
                        {cat._count?.products ?? 0} items
                      </span>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-ink-700">
                      No categories found. Use the creation panel to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

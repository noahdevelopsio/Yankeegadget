import React from "react";
import prisma from "@/lib/prisma";
import ProductForm from "../ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Mock Fallback categories
const MOCK_CATEGORIES = [
  { id: "c1", name: "Phones" },
  { id: "c2", name: "Earbuds" },
  { id: "c3", name: "Accessories" },
  { id: "c4", name: "Gaming" },
  { id: "c5", name: "Consoles" },
];

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return { categories, dbConnected: true };
  } catch (error) {
    console.warn("Database connection failed in Product creation, serving mocks:", error);
    return { categories: MOCK_CATEGORIES, dbConnected: false };
  }
}

export default async function NewProductPage() {
  const { categories, dbConnected } = await getCategories();

  return (
    <div className="space-y-6">
      
      {/* Back link */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-brand-orange-light transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-2xl font-display font-black text-ink-900">
          Add New Product
        </h1>
        <p className="text-sm text-ink-700 mt-1">
          Complete the details below to add a new premium gadget to the catalog.
        </p>
      </div>

      {!dbConnected && (
        <div className="bg-warning/15 text-warning text-xs font-semibold py-2.5 px-4 rounded-lg border border-warning/20">
          ⚠️ DB Offline. Forms can be reviewed but submits require active server postgres credentials.
        </div>
      )}

      {/* Shared form */}
      <ProductForm categories={categories} />

    </div>
  );
}

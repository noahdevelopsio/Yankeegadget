import React from "react";
import prisma from "@/lib/prisma";
import ProductForm from "../../ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

// Mock Fallback categories
const MOCK_CATEGORIES = [
  { id: "c1", name: "Phones" },
  { id: "c2", name: "Consoles" },
];

const MOCK_PRODUCT = {
  id: "p1",
  name: "iPhone 15 Pro Max 256GB",
  brand: "Apple",
  sku: "AP-IP15PM-256",
  price: 185000000,
  compareAtPrice: 195000000,
  stock: 12,
  description: "A premium flagship smartphone.",
  image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
  categoryId: "c1",
  isPublished: true,
  specs: JSON.stringify({ RAM: "8GB", Storage: "256GB" }),
  metaTitle: "Buy iPhone 15 Pro Max",
  metaDescription: "Get the best price for iPhone 15 Pro Max.",
};

async function getProductAndCategories(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { product, categories, dbConnected: true };
  } catch (error) {
    console.warn("Database connection failed in Product edit, serving mocks:", error);
    if (id === "p1") {
      return { product: MOCK_PRODUCT, categories: MOCK_CATEGORIES, dbConnected: false };
    }
    return { product: null, categories: MOCK_CATEGORIES, dbConnected: false };
  }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { product, categories, dbConnected } = await getProductAndCategories(params.id);

  if (!product) {
    return notFound();
  }

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
          Edit Product Details
        </h1>
        <p className="text-sm text-ink-700 mt-1">
          Modify the catalog fields for &ldquo;{product.name}&rdquo;
        </p>
      </div>

      {!dbConnected && (
        <div className="bg-warning/15 text-warning text-xs font-semibold py-2.5 px-4 rounded-lg border border-warning/20">
          ⚠️ DB Offline. Forms can be reviewed but submits require active server postgres credentials.
        </div>
      )}

      {/* Shared form */}
      <ProductForm categories={categories} initialProduct={product as any} />

    </div>
  );
}

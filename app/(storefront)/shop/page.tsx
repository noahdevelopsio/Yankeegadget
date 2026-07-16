import React from "react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/storefront/ProductCard";
import SortSelect from "@/components/storefront/SortSelect";
import PriceFilterForm from "@/components/storefront/PriceFilterForm";
import Link from "next/link";

export const revalidate = 60; // ISR revalidation every 60 seconds

interface ShopPageProps {
  searchParams: {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    sort?: string;
  };
}

async function getShopData(params: ShopPageProps["searchParams"]) {
  try {
    const categories = await prisma.category.findMany();
    
    // Construct Prisma Query Conditions
    const where: any = { isPublished: true };

    if (params.category) {
      where.category = { slug: params.category };
    }
    
    if (params.brand) {
      where.brand = params.brand;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { brand: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    // Pricing conditions (Naira to Kobo conversion)
    if (params.minPrice) {
      const minKobo = parseInt(params.minPrice) * 100;
      if (!isNaN(minKobo)) {
        where.price = { ...(where.price || {}), gte: minKobo };
      }
    }
    if (params.maxPrice) {
      const maxKobo = parseInt(params.maxPrice) * 100;
      if (!isNaN(maxKobo)) {
        where.price = { ...(where.price || {}), lte: maxKobo };
      }
    }

    // Sort order definition
    let orderBy: any = { createdAt: "desc" };
    if (params.sort === "price_asc") {
      orderBy = { price: "asc" };
    } else if (params.sort === "price_desc") {
      orderBy = { price: "desc" };
    } else if (params.sort === "newest") {
      orderBy = { createdAt: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
    });

    return {
      categories,
      products,
    };
  } catch (error) {
    console.error("Database connection failed on Shop listing:", error);
    return {
      categories: [],
      products: [],
    };
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { categories, products } = await getShopData(searchParams);

  // Derive unique brands for filters
  const uniqueBrands = ["Apple", "Samsung", "Sony"];

  // Helper to build filter query string links
  const createFilterLink = (key: string, value: string | null) => {
    const params = new URLSearchParams();
    
    // Copy existing search parameters
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.brand) params.set("brand", searchParams.brand);
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
    if (searchParams.sort) params.set("sort", searchParams.sort);

    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    return `/shop?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-12">


      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-ink-900">
            {searchParams.category
              ? `Shop ${categories.find(c => c.slug === searchParams.category)?.name || "Gadgets"}`
              : "Shop All Gadgets"}
          </h1>
          <p className="text-sm text-ink-700 mt-1">
            Showing {products.length} products
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs font-bold uppercase tracking-wider text-ink-700 shrink-0">
            Sort By
          </label>
          <SortSelect currentSort={searchParams.sort || "newest"} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="space-y-8">
          
          {/* Active Filters Summary */}
          {(searchParams.category || searchParams.brand || searchParams.search || searchParams.minPrice || searchParams.maxPrice) && (
            <div className="p-4 bg-brand-orange/5 rounded-xl border border-brand-orange/10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Active Filters
                </h3>
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-brand-orange hover:underline"
                >
                  Clear All
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchParams.category && (
                  <span className="text-xs bg-white text-ink-900 px-2.5 py-1 rounded-md border border-border font-medium">
                    Category: {categories.find(c => c.slug === searchParams.category)?.name || searchParams.category}
                  </span>
                )}
                {searchParams.brand && (
                  <span className="text-xs bg-white text-ink-900 px-2.5 py-1 rounded-md border border-border font-medium">
                    Brand: {searchParams.brand}
                  </span>
                )}
                {searchParams.search && (
                  <span className="text-xs bg-white text-ink-900 px-2.5 py-1 rounded-md border border-border font-medium">
                    Search: &quot;{searchParams.search}&quot;
                  </span>
                )}
                {(searchParams.minPrice || searchParams.maxPrice) && (
                  <span className="text-xs bg-white text-ink-900 px-2.5 py-1 rounded-md border border-border font-medium">
                    Price: ₦{searchParams.minPrice || "0"} - ₦{searchParams.maxPrice || "Max"}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Categories Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Categories
            </h3>
            <div className="flex flex-col space-y-1.5">
              <Link
                href={createFilterLink("category", null)}
                className={`text-sm py-1 font-medium transition-colors ${!searchParams.category ? "text-brand-orange font-bold" : "text-ink-700 hover:text-brand-orange"}`}
              >
                All Categories
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={createFilterLink("category", cat.slug)}
                  className={`text-sm py-1 font-medium transition-colors ${searchParams.category === cat.slug ? "text-brand-orange font-bold" : "text-ink-700 hover:text-brand-orange"}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Brands Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Brands
            </h3>
            <div className="flex flex-col space-y-1.5">
              <Link
                href={createFilterLink("brand", null)}
                className={`text-sm py-1 font-medium transition-colors ${!searchParams.brand ? "text-brand-orange font-bold" : "text-ink-700 hover:text-brand-orange"}`}
              >
                All Brands
              </Link>
              {uniqueBrands.map((brand) => (
                <Link
                  key={brand}
                  href={createFilterLink("brand", brand)}
                  className={`text-sm py-1 font-medium transition-colors ${searchParams.brand === brand ? "text-brand-orange font-bold" : "text-ink-700 hover:text-brand-orange"}`}
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* Price Range Filter Form */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Price Range (₦)
            </h3>
            <PriceFilterForm
              initialMinPrice={searchParams.minPrice || ""}
              initialMaxPrice={searchParams.maxPrice || ""}
            />
          </div>

        </aside>

        {/* Product Grid Content */}
        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-surface-alt border border-border rounded-xl p-12 text-center">
              <h3 className="text-lg font-display font-bold text-ink-900 mb-2">
                No products found
              </h3>
              <p className="text-sm text-ink-700 mb-6">
                We couldn&apos;t find any products matching your search criteria. Try modifying your filter values or search query.
              </p>
              <Link
                href="/shop"
                className="bg-brand-orange text-white hover:bg-brand-orange-light px-6 py-3 rounded-lg text-sm font-semibold inline-block transition-colors"
              >
                Reset Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

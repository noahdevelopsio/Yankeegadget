"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Helper to ensure authenticated role
async function checkAuth() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
    throw new Error("Unauthorized admin command.");
  }
  return session;
}

/**
 * Toggle the publish state of a product
 */
export async function toggleProductPublish(productId: string) {
  try {
    await checkAuth();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return { success: false, error: "Product not found." };

    await prisma.product.update({
      where: { id: productId },
      data: { isPublished: !product.isPublished },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Action failed." };
  }
}

/**
 * Delete a product from the catalog
 */
export async function deleteProduct(productId: string) {
  try {
    await checkAuth();

    // Cascading deletes handled by schema cascades on variants & images
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Delete failed." };
  }
}

/**
 * Create a new product category
 */
export async function createCategory(name: string) {
  try {
    await checkAuth();
    if (!name.trim()) return { success: false, error: "Category name is required." };

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "A category with this name/slug already exists." };
    }
    return { success: false, error: error.message || "Failed to create category." };
  }
}

/**
 * Update an order's shipping status
 */
export async function updateOrderStatus(orderId: string, status: any) {
  try {
    await checkAuth();

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update order status." };
  }
}

/**
 * Manually override a payment's status (e.g. verified bank transfers)
 */
export async function manuallyConfirmPayment(paymentId: string) {
  try {
    const session = await checkAuth();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) return { success: false, error: "Payment record not found." };
    if (payment.status === "SUCCESSFUL") return { success: false, error: "Payment is already marked successful." };

    await prisma.$transaction([
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "PAID" },
      }),
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "SUCCESSFUL",
          channel: "banktransfer_manual",
          verifiedAt: new Date(),
        },
      }),
      prisma.adminActivityLog.create({
        data: {
          adminId: session.id,
          action: "MANUAL_PAYMENT_CONFIRM",
          entity: "Payment",
          entityId: paymentId,
          metadata: { confirmedBy: session.name },
        },
      }),
    ]);

    revalidatePath("/admin/payments");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Manual verification override failed." };
  }
}

export interface SaveProductInput {
  id?: string;
  name: string;
  brand: string;
  sku: string;
  price: number; // in kobo
  compareAtPrice?: number; // in kobo
  stock: number;
  description: string;
  image: string;
  categoryId: string;
  isPublished: boolean;
  specs: string; // JSON string
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Create or update a product
 */
export async function saveProduct(data: SaveProductInput) {
  try {
    await checkAuth();

    const { id, name, brand, sku, price, compareAtPrice, stock, description, image, categoryId, isPublished, specs, metaTitle, metaDescription } = data;

    if (!name || !price || !categoryId || !image) {
      return { success: false, error: "Please fill in all required product details." };
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const productData = {
      name: name.trim(),
      slug,
      brand: brand.trim(),
      sku: sku.trim() || undefined,
      price,
      compareAtPrice: compareAtPrice || null,
      stock,
      description,
      image,
      categoryId,
      isPublished,
      specs,
      metaTitle: metaTitle?.trim() || undefined,
      metaDescription: metaDescription?.trim() || undefined,
    };

    if (id) {
      // Edit existing product
      await prisma.product.update({
        where: { id },
        data: productData,
      });
    } else {
      // Create new product
      await prisma.product.create({
        data: productData,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save product." };
  }
}


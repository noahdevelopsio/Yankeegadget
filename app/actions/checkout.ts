"use server";

import prisma from "@/lib/prisma";

export interface CheckoutInput {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  state: string;
  lga: string;
  couponCode?: string;
  items: {
    productId: string;
    quantity: number;
    selectedVariant?: {
      id: string;
      name: string;
      value: string;
      priceDiff: number;
    };
  }[];
}

// Simple Delivery Fee configurations in kobo (NGN * 100)
const DELIVERY_FEES: Record<string, number> = {
  "Lagos Mainland": 250000,   // ₦2,500
  "Lagos Island": 400000,     // ₦4,000
  "Outside Lagos": 650000,    // ₦6,500 (Nationwide)
};

export async function createOrder(data: CheckoutInput) {
  try {
    const { fullName, email, phone, streetAddress, state, lga, items, couponCode } = data;

    // Basic Input Validations
    if (!fullName || !email || !phone || !streetAddress || !state || !lga) {
      return { success: false, error: "Please fill in all required shipping fields." };
    }
    if (!items || items.length === 0) {
      return { success: false, error: "Your shopping cart is empty." };
    }

    // Determine shipping zone and delivery fee
    let shippingZone = "Outside Lagos";
    if (state.toLowerCase().includes("lagos")) {
      // Differentiate Lagos Mainland vs Island
      if (
        lga.toLowerCase().includes("lekki") || 
        lga.toLowerCase().includes("ikoyi") || 
        lga.toLowerCase().includes("victoria island") || 
        lga.toLowerCase().includes("island") ||
        lga.toLowerCase().includes("eti-osa")
      ) {
        shippingZone = "Lagos Island";
      } else {
        shippingZone = "Lagos Mainland";
      }
    }
    const deliveryFee = DELIVERY_FEES[shippingZone] || DELIVERY_FEES["Outside Lagos"];

    // Generate unique order reference details
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const orderNumber = `YG-${timestamp}-${randomSuffix}`;
    const txRef = `YG-TXREF-${timestamp}-${randomSuffix}`;

    // Database Transactions
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsToCreate = [];

      // Fetch products and calculate final item costs
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isPublished) {
          throw new Error(`Product not found or currently unavailable.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} items left.`);
        }

        const variantPriceDiff = item.selectedVariant?.priceDiff || 0;
        const unitPrice = product.price + variantPriceDiff;
        subtotal += unitPrice * item.quantity;

        // Track items to insert
        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: unitPrice,
          variantInfo: item.selectedVariant ? JSON.stringify(item.selectedVariant) : undefined,
        });

        // Deduct inventory stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Check coupon discounts if configured
      let discountAmount = 0;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });
        if (coupon && coupon.isActive) {
          if (coupon.type === "percent") {
            discountAmount = Math.round((subtotal * coupon.value) / 100);
          } else if (coupon.type === "fixed") {
            discountAmount = coupon.value;
          }
        }
      }

      const discountedSubtotal = Math.max(0, subtotal - discountAmount);
      const total = discountedSubtotal + deliveryFee;

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          guestEmail: email,
          guestPhone: phone,
          subtotal: discountedSubtotal,
          deliveryFee,
          total,
          deliveryState: state,
          deliveryLga: lga,
          deliveryAddress: streetAddress,
          status: "PENDING",
          items: {
            create: orderItemsToCreate,
          },
        },
      });

      // Create Payment
      await tx.payment.create({
        data: {
          orderId: order.id,
          flutterwaveTxRef: txRef,
          amount: total,
          status: "PENDING",
        },
      });

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: total,
        txRef: txRef,
      };
    });

    return {
      success: true,
      orderNumber: result.orderNumber,
      orderId: result.orderId,
      txRef: result.txRef,
      totalAmount: result.totalAmount,
    };

  } catch (error: any) {
    console.error("Checkout transaction failed:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while placing your order. Please try again.",
    };
  }
}

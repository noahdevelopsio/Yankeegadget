import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { verifyTransaction } from "@/lib/flutterwave";
import { CheckCircle2, XCircle, AlertTriangle, MessageCircle, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Yankee Gadgets",
  description: "Thank you for shopping with Yankee Gadgets. Your order status and payment confirmation details.",
};

interface SuccessPageProps {
  searchParams: {
    orderNumber?: string;
    status?: string;
    tx_ref?: string;
    transaction_id?: string;
  };
}

async function getOrderAndVerifyPayment(params: SuccessPageProps["searchParams"]) {
  const transactionId = params.transaction_id;
  const orderNumberParam = params.orderNumber;
  const txRefParam = params.tx_ref;

  try {
    let order: any = null;
    let paymentVerified = false;
    let paymentStatusMessage = "PENDING PAYMENT";
    let verificationError = "";

    // 1. If transaction_id is returned from Flutterwave redirect, verify payment
    if (transactionId) {
      const verificationResult = await verifyTransaction(transactionId);
      
      if (verificationResult.success && verificationResult.status === "successful" && verificationResult.txRef) {
        // Find the payment record associated with the transaction reference
        const paymentRecord = await prisma.payment.findUnique({
          where: { flutterwaveTxRef: verificationResult.txRef },
          include: { order: { include: { items: { include: { product: true } } } } },
        });

        if (paymentRecord) {
          order = paymentRecord.order;
          
          // Verify that the amount matches the payment amount (within NGN conversion)
          const expectedAmountInNaira = paymentRecord.amount / 100;
          const verifiedAmountInNaira = verificationResult.amount || 0;

          if (Math.abs(expectedAmountInNaira - verifiedAmountInNaira) < 0.01) {
            paymentVerified = true;
            paymentStatusMessage = "PAID (CONFIRMED)";

            // Update database states asynchronously / idempotently if not already paid
            if (paymentRecord.status !== "SUCCESSFUL" || order.status !== "PAID") {
              await prisma.$transaction([
                prisma.order.update({
                  where: { id: order.id },
                  data: { status: "PAID" },
                }),
                prisma.payment.update({
                  where: { id: paymentRecord.id },
                  data: {
                    status: "SUCCESSFUL",
                    flutterwaveTxId: transactionId,
                    channel: verificationResult.paymentType || "card",
                    verifiedAt: new Date(),
                  },
                }),
              ]);
              
              // Refetch to reflect updated state
              order.status = "PAID";
            }
          } else {
            verificationError = `Amount mismatch. Expected ₦${expectedAmountInNaira}, got ₦${verifiedAmountInNaira}.`;
            paymentStatusMessage = "PAYMENT VERIFICATION ERROR";
          }
        } else {
          verificationError = "Payment transaction reference not found in our database.";
          paymentStatusMessage = "PAYMENT REFERENCE ERROR";
        }
      } else {
        verificationError = "Flutterwave payment verification status was unsuccessful or pending.";
        paymentStatusMessage = "PAYMENT FAILED OR PENDING";
      }
    }

    // 2. Fallback: Find order by orderNumber or txRef if no transactionId is present
    if (!order) {
      if (orderNumberParam) {
        order = await prisma.order.findUnique({
          where: { orderNumber: orderNumberParam },
          include: { items: { include: { product: true } } },
        });
      } else if (txRefParam) {
        const paymentRecord = await prisma.payment.findUnique({
          where: { flutterwaveTxRef: txRefParam },
          include: { order: { include: { items: { include: { product: true } } } } },
        });
        if (paymentRecord) {
          order = paymentRecord.order;
          paymentStatusMessage = paymentRecord.status === "SUCCESSFUL" ? "PAID (CONFIRMED)" : "PENDING PAYMENT";
        }
      }
    }

    // Retrieve final status from loaded order
    if (order && order.status === "PAID") {
      paymentStatusMessage = "PAID (CONFIRMED)";
      paymentVerified = true;
    }

    return {
      order,
      paymentVerified,
      paymentStatusMessage,
      verificationError,
      dbConnected: true,
    };

  } catch (error) {
    console.error("Database connection or payment verification failed:", error);
    
    // Serve fallback mockup confirmation
    return {
      order: null,
      paymentVerified: params.status === "successful",
      paymentStatusMessage: params.status === "successful" ? "PAID (MOCK SUCCESS)" : "PENDING (MOCK MODE)",
      verificationError: "",
      dbConnected: false,
    };
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const orderNumber = searchParams.orderNumber || searchParams.tx_ref || "YG-MOCK-ORDER";
  const { order, paymentVerified, paymentStatusMessage, verificationError, dbConnected } = 
    await getOrderAndVerifyPayment(searchParams);

  // Format helper
  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  const finalOrderNumber = order ? order.orderNumber : orderNumber;

  // WhatsApp confirm link details
  const whatsappPhone = "2349037036463";
  const whatsappMsg = encodeURIComponent(
    `Hello Yankee Gadgets! I just placed order ${finalOrderNumber} on your website. Payment Status: ${paymentStatusMessage}. Please confirm delivery.`
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMsg}`;

  // Estimate delivery time based on selected region
  const getDeliveryEstimate = (state: string) => {
    if (!state) return "2-4 Business Days";
    if (state.toLowerCase().includes("lagos")) {
      return "24 to 48 Hours (Same-Day Delivery optional)";
    }
    return "3 to 5 Business Days (Nationwide Dispatch)";
  };

  return (
    <div className="bg-surface-alt min-h-screen py-16 px-4">
      <div className="mx-auto max-w-2xl bg-white rounded-2xl border border-border p-6 sm:p-10 shadow-premium text-center">
        
        {/* Animated Checkmark or Alert icon based on Payment Status */}
        {paymentVerified ? (
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-6 border border-green-200">
            <CheckCircle2 className="w-12 h-12 animate-pulse" />
          </div>
        ) : verificationError ? (
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-error mb-6 border border-red-200">
            <XCircle className="w-12 h-12" />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 text-warning mb-6 border border-amber-200">
            <AlertTriangle className="w-12 h-12 animate-bounce" />
          </div>
        )}

        <h1 className="text-3xl font-display font-black text-ink-900 mb-2">
          {paymentVerified ? "Order Confirmed & Paid!" : "Order Placed Successfully"}
        </h1>
        <p className="text-sm text-ink-700 max-w-md mx-auto mb-6">
          {paymentVerified 
            ? "Your payment was verified successfully. Our dispatch riders are packing your gadgets for shipment."
            : "Your order is logged. We are currently verifying your payment. If you paid via bank transfer, you can notify us below."
          }
        </p>

        {verificationError && (
          <div className="mb-6 p-3 bg-red-50 text-error border border-red-200 text-xs rounded-lg font-medium max-w-md mx-auto text-left">
            <strong>Verification Alert:</strong> {verificationError}
          </div>
        )}

        {/* Order Reference Card */}
        <div className="bg-surface-alt rounded-xl p-5 border border-border text-left mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between border-b border-border/60 pb-3 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Order Reference</span>
              <p className="text-base font-bold font-display text-ink-900">{finalOrderNumber}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Payment Status</span>
              <p className={`text-sm font-bold uppercase ${paymentVerified ? "text-green-600" : "text-warning"}`}>
                {paymentStatusMessage}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-ink-700">
            {/* Delivery address */}
            <div className="space-y-1">
              <span className="font-bold text-ink-900 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                Shipping To
              </span>
              <p className="font-medium text-ink-900 mt-1">
                {order ? order.deliveryAddress : "Your Specified Street Address"}
              </p>
              <p>
                {order ? `${order.deliveryLga}, ${order.deliveryState}` : "Lagos, Nigeria"}
              </p>
            </div>

            {/* Delivery Time Estimation */}
            <div className="space-y-1">
              <span className="font-bold text-ink-900 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                Estimated Arrival
              </span>
              <p className="font-semibold text-ink-900 mt-1">
                {getDeliveryEstimate(order ? order.deliveryState : "Lagos")}
              </p>
              <p className="text-[10px] text-ink-400">
                Dispatch notifications will be sent to your email.
              </p>
            </div>
          </div>

          {order && (
            <div className="border-t border-border/60 pt-3 flex justify-between items-center text-sm font-bold text-ink-900">
              <span>Total Amount</span>
              <span className="text-base font-display text-brand-orange font-black">
                {formatPrice(order.total)}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-premium"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
            <span>Confirm via WhatsApp</span>
          </a>

          <Link
            href="/shop"
            className="w-full sm:w-auto flex items-center justify-center border border-border bg-white text-ink-900 hover:bg-surface-alt px-8 py-3.5 rounded-xl font-bold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support contacts */}
        <div className="mt-10 pt-8 border-t border-border/60 flex flex-wrap justify-center gap-6 text-xs text-ink-700">
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-ink-400" />
            +234 807 308 3426
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-ink-400" />
            support@yankeegadgets.ng
          </span>
        </div>

      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTransaction } from "@/lib/flutterwave";

export async function POST(req: NextRequest) {
  try {
    // 1. Signature Verification Check
    const signature = req.headers.get("verif-hash");
    const secretHash = process.env.FLW_SECRET_HASH;

    if (!secretHash) {
      console.warn("FLW_SECRET_HASH is not configured on the server. Skipping webhook verification check.");
    } else if (!signature || signature !== secretHash) {
      console.warn("Webhook transaction hash verification mismatch. Unauthorized request.");
      return NextResponse.json({ error: "Unauthorized signature hash check." }, { status: 401 });
    }

    // 2. Parse payload request
    const payload = await req.json();
    const transactionId = payload.data?.id;

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID not found in webhook payload." }, { status: 400 });
    }

    console.log(`Processing Flutterwave webhook transaction ID: ${transactionId}...`);

    // 3. Source of Truth verification check with Flutterwave
    const verification = await verifyTransaction(String(transactionId));

    if (!verification.success || verification.status !== "successful" || !verification.txRef) {
      console.warn(`Transaction verification unsuccessful for ID: ${transactionId}. Status: ${verification.status}`);
      return NextResponse.json({ error: "Transaction is not successful or verify check failed." }, { status: 200 }); // return 200 so Flutterwave stops retrying
    }

    // 4. Update order and payment states idempotently
    const payment = await prisma.payment.findUnique({
      where: { flutterwaveTxRef: verification.txRef },
      include: { order: true },
    });

    if (!payment) {
      console.error(`Associated payment record not found for reference: ${verification.txRef}`);
      return NextResponse.json({ error: "Payment reference not found." }, { status: 200 });
    }

    // Idempotency: skip if transaction is already marked successful
    if (payment.status === "SUCCESSFUL" && payment.order.status === "PAID") {
      console.log(`Transaction ID: ${transactionId} has already been marked paid.`);
      return NextResponse.json({ received: true, message: "Transaction already processed." }, { status: 200 });
    }

    // Double check that the paid amount matches what is in the payment record (within Naira rounding range)
    const expectedAmountInNaira = payment.amount / 100;
    const paidAmountInNaira = verification.amount || 0;

    if (Math.abs(expectedAmountInNaira - paidAmountInNaira) > 0.01) {
      console.error(`Amount mismatch error. Expected: ${expectedAmountInNaira}, Received: ${paidAmountInNaira}`);
      
      // Update payment record to FAILED with comments
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          flutterwaveTxId: String(transactionId),
          rawWebhookPayload: payload,
        },
      });
      return NextResponse.json({ error: "Amount verification failed." }, { status: 200 });
    }

    // Perform database atomic updates
    await prisma.$transaction([
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "PAID" },
      }),
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESSFUL",
          flutterwaveTxId: String(transactionId),
          channel: verification.paymentType || "card",
          rawWebhookPayload: payload,
          verifiedAt: new Date(),
        },
      }),
    ]);

    console.log(`Payment confirmed and order ${payment.order.orderNumber} successfully finalized!`);
    return NextResponse.json({ received: true, status: "SUCCESSFUL" }, { status: 200 });

  } catch (error: any) {
    console.error("Flutterwave webhook processing crash:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

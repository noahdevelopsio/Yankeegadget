export interface InitializePaymentInput {
  txRef: string;
  amountInKobo: number;
  email: string;
  name: string;
  phone: string;
}

export interface VerifyTransactionResponse {
  success: boolean;
  status?: string;
  amount?: number; // in NGN
  currency?: string;
  txRef?: string;
  paymentType?: string;
  raw?: any;
}

/**
 * Initializes a standard Flutterwave payment link redirection.
 */
export async function initializePayment(data: InitializePaymentInput): Promise<string> {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing FLUTTERWAVE_SECRET_KEY environment variable.");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const amountInNaira = data.amountInKobo / 100;

  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: data.txRef,
        amount: amountInNaira,
        currency: "NGN",
        redirect_url: `${siteUrl}/checkout/success`,
        customer: {
          email: data.email,
          phonenumber: data.phone,
          name: data.name,
        },
        customizations: {
          title: "Yankee Gadgets NG",
          description: "Payment for your gadgets purchase",
          logo: `${siteUrl}/icon.svg`,
        },
      }),
    });

    const result = await response.json();

    if (response.ok && result.status === "success" && result.data?.link) {
      return result.data.link;
    } else {
      console.error("Flutterwave payment initialization error response:", result);
      throw new Error(result.message || "Failed to initialize payment with Flutterwave.");
    }
  } catch (error: any) {
    console.error("Flutterwave payment initialization API failure:", error);
    throw new Error(error.message || "Connection timeout with Flutterwave.");
  }
}

/**
 * Calls Flutterwave Transactions API to verify the status of a specific transaction ID.
 */
export async function verifyTransaction(transactionId: string): Promise<VerifyTransactionResponse> {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing FLUTTERWAVE_SECRET_KEY environment variable.");
  }

  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok && result.status === "success" && result.data) {
      const txData = result.data;
      return {
        success: true,
        status: txData.status, // "successful", "failed"
        amount: txData.amount, // in Naira
        currency: txData.currency,
        txRef: txData.tx_ref,
        paymentType: txData.payment_type,
        raw: txData,
      };
    } else {
      console.error("Flutterwave transaction verification error response:", result);
      return { success: false, raw: result };
    }
  } catch (error: any) {
    console.error("Flutterwave transaction verification API failure:", error);
    return { success: false, raw: error };
  }
}

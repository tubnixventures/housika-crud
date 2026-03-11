import crypto from "crypto";
import { updatePaymentModel } from "../../models/payments/updatePayment.model.js";
import dotenv from 'dotenv';
dotenv.config()

export async function paystackWebhookController(req: any) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const signature = req.headers["x-paystack-signature"];

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== signature) {
    throw new Error("Invalid Paystack signature");
  }

  const event = req.body.event;
  const data = req.body.data;

  // Example: handle charge.success
  if (event === "charge.success") {
    await updatePaymentModel(data.reference, {
      status: "success",
      gateway_reference: data.reference,
    });
  }

  return { received: true };
}

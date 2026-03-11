import { updatePaymentModel } from "../../models/payments/updatePayment.model.js";
export async function paystackCallbackController(req) {
    const reference = req.query.reference;
    if (!reference)
        throw new Error("Missing reference");
    // Here you would call Paystack verify endpoint (via axios/fetch)
    // Example: const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
    // For now, assume verified
    await updatePaymentModel(reference, { status: "success" });
    return { verified: true, reference };
}

import { query } from "../../utils/db.js";
import { z } from "zod";
const PaymentSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    booking_id: z.string().uuid(),
    property_id: z.string().uuid(),
    room_number: z.string().min(1).max(50),
    receipt_id: z.string().uuid().optional(),
    receipt_number: z.string().optional(),
    reference_type: z.string().min(1).max(50),
    gateway: z.string().min(1).max(50), // e.g. "paystack"
    gateway_reference: z.string().min(1).max(100),
    amount: z.number().nonnegative(),
    currency: z.string().min(1).max(10),
    status: z.string().min(1).max(50),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});
export async function createPaymentModel(payment) {
    const parsed = PaymentSchema.parse(payment);
    return await query(`INSERT INTO payments (id, user_id, booking_id, property_id, room_number, receipt_id, receipt_number, reference_type, gateway, gateway_reference, amount, currency, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [
        parsed.id,
        parsed.user_id,
        parsed.booking_id,
        parsed.property_id,
        parsed.room_number,
        parsed.receipt_id,
        parsed.receipt_number,
        parsed.reference_type,
        parsed.gateway,
        parsed.gateway_reference,
        parsed.amount,
        parsed.currency,
        parsed.status,
    ]);
}

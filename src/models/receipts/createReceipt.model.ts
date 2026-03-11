import { query } from "../../utils/db.js";
import { z } from "zod";

const ReceiptSchema = z.object({
  id: z.string().uuid(),
  receipt_number: z.string().min(1).max(100),
  user_id: z.string().uuid(),
  landlord_id: z.string().uuid(),
  property_id: z.string().uuid(),
  room_number: z.string().min(1).max(50),
  booking_id: z.string().uuid(),
  payment_id: z.string().uuid(),
  file_url: z.string().url().optional(),
  amount: z.number().nonnegative(),
  currency: z.string().min(1).max(10),
  qr_code: z.string().optional(),
  verification_status: z.string().optional(),
  verified_at: z.date().optional(),
  issued_by: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  expires_at: z.date().optional(),
});

export type ReceiptType = z.infer<typeof ReceiptSchema>;

export async function createReceiptModel(receipt: ReceiptType) {
  const parsed = ReceiptSchema.parse(receipt);
  return await query(
    `INSERT INTO receipts (id, receipt_number, user_id, landlord_id, property_id, room_number, booking_id, payment_id, file_url, amount, currency, qr_code, verification_status, verified_at, issued_by, created_at, updated_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
    [
      parsed.id,
      parsed.receipt_number,
      parsed.user_id,
      parsed.landlord_id,
      parsed.property_id,
      parsed.room_number,
      parsed.booking_id,
      parsed.payment_id,
      parsed.file_url,
      parsed.amount,
      parsed.currency,
      parsed.qr_code,
      parsed.verification_status,
      parsed.verified_at,
      parsed.issued_by,
      parsed.expires_at,
    ]
  );
}

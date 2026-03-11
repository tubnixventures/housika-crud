import { query } from "../../utils/db.js";
import { z } from "zod";

const BookingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  property_id: z.string().uuid(),
  room_id: z.string().uuid(),
  room_number: z.string().min(1).max(50),
  payment_id: z.string().uuid(),
  receipt_id: z.string().uuid().optional(),
  receipt_number: z.string().optional(),
  start_at: z.date(),
  ends_at: z.date(),
  status: z.string().min(1).max(50),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type BookingType = z.infer<typeof BookingSchema>;

export async function createBookingModel(booking: BookingType) {
  const parsed = BookingSchema.parse(booking);
  return await query(
    `INSERT INTO bookings (id, user_id, property_id, room_id, room_number, payment_id, receipt_id, receipt_number, start_at, ends_at, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      parsed.id,
      parsed.user_id,
      parsed.property_id,
      parsed.room_id,
      parsed.room_number,
      parsed.payment_id,
      parsed.receipt_id,
      parsed.receipt_number,
      parsed.start_at,
      parsed.ends_at,
      parsed.status,
    ]
  );
}

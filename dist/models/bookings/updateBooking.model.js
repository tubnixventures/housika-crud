import { query } from "../../utils/db.js";
import { z } from "zod";
const BookingUpdateSchema = z.object({
    room_number: z.string().min(1).max(50).optional(),
    payment_id: z.string().uuid().optional(),
    receipt_id: z.string().uuid().optional(),
    receipt_number: z.string().optional(),
    start_at: z.date().optional(),
    ends_at: z.date().optional(),
    status: z.string().min(1).max(50).optional(),
});
export async function updateBookingModel(id, updates) {
    const parsed = BookingUpdateSchema.parse(updates);
    const fields = Object.keys(parsed).map((k) => `${k}=?`).join(", ");
    const values = Object.values(parsed);
    return await query(`UPDATE bookings SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [...values, id]);
}

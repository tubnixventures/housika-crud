import { query } from "../../utils/db.js";
import { z } from "zod";
const RoomUpdateSchema = z.object({
    room_number: z.string().min(1).max(50).optional(),
    category: z.string().min(1).max(50).optional(),
    currency: z.string().min(1).max(10).optional(),
    country: z.string().min(2).max(50).optional(),
    location: z.string().min(1).max(100).optional(),
    exact_location: z.string().max(200).optional(),
    amount: z.number().nonnegative().optional(),
    period: z.string().min(1).max(50).optional(),
    is_occupied: z.boolean().optional(),
    start_at: z.date().optional(),
    ends_at: z.date().optional(),
    image_urls: z.string().optional(),
    video_urls: z.string().optional(),
    capacity: z.number().int().nonnegative().optional(),
    amenities: z.string().optional(),
});
export async function updateRoomModel(id, updates) {
    const parsed = RoomUpdateSchema.parse(updates);
    const fields = Object.keys(parsed).map((k) => `${k}=?`).join(", ");
    const values = Object.values(parsed);
    return await query(`UPDATE rooms SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [...values, id]);
}

import { query } from "../../utils/db.js";
export async function listBookingsModel(limit = 30, offset = 0, userId) {
    if (userId) {
        return await query(`SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`, [userId, limit, offset]);
    }
    return await query(`SELECT * FROM bookings ORDER BY created_at DESC LIMIT ? OFFSET ?`, [limit, offset]);
}

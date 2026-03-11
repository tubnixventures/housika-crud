import { query } from "../../utils/db.js";
export async function deleteBookingModel(id) {
    return await query(`DELETE FROM bookings WHERE id=?`, [id]);
}

import { query } from "../../utils/db.js";

export async function getBookingModel(id: string) {
  return await query(`SELECT * FROM bookings WHERE id=? LIMIT 1`, [id]);
}

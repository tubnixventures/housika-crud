import { query } from "../../utils/db.js";
export async function getRoomModel(id) {
    return await query(`SELECT * FROM rooms WHERE id=? LIMIT 1`, [id]);
}

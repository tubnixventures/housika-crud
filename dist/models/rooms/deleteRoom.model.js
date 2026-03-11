import { query } from "../../utils/db.js";
export async function deleteRoomModel(id) {
    return await query(`DELETE FROM rooms WHERE id=?`, [id]);
}

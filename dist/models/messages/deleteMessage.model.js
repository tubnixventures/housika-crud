import { query } from "../../utils/db.js";
export async function deleteMessageModel(id) {
    return await query(`DELETE FROM messages WHERE id=?`, [id]);
}

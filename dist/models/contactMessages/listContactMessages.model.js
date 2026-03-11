import { query } from "../../utils/db.js";
export async function listContactMessagesModel(limit = 30) {
    return await query(`SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ?`, [limit]);
}

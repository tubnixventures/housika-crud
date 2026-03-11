import { query } from "../../utils/db.js";
export async function listMessagesModel(limit = 30) {
    return await query(`SELECT * FROM messages ORDER BY created_at DESC LIMIT ?`, [limit]);
}

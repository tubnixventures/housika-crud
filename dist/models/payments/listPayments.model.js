import { query } from "../../utils/db.js";
export async function listPaymentsModel(limit = 30) {
    return await query(`SELECT * FROM payments ORDER BY created_at DESC LIMIT ?`, [limit]);
}

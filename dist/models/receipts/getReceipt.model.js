import { query } from "../../utils/db.js";
export async function getReceiptModel(id) {
    return await query(`SELECT * FROM receipts WHERE id=? LIMIT 1`, [id]);
}

import { query } from "../../utils/db.js";

export async function getReceiptModel(id: string) {
  return await query(`SELECT * FROM receipts WHERE id=? LIMIT 1`, [id]);
}

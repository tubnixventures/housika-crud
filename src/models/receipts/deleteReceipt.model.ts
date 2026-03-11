import { query } from "../../utils/db.js";

export async function deleteReceiptModel(id: string) {
  return await query(`DELETE FROM receipts WHERE id=?`, [id]);
}

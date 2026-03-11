import { query } from "../../utils/db.js";

export async function listReceiptsModel(limit = 30) {
  return await query(
    `SELECT * FROM receipts ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
}

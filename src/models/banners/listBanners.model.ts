import { query } from "../../utils/db.js";

export async function listBannersModel(limit = 30) {
  return await query(
    `SELECT * FROM banners WHERE is_active=TRUE ORDER BY start_at DESC LIMIT ?`,
    [limit]
  );
}

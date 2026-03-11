import { query } from "../../utils/db.js";

export async function listRoomsModel(limit = 30, offset = 0) {
  return await query(
    `SELECT * FROM rooms ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
}

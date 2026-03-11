import { query } from "../../utils/db.js";

export async function deleteMessageModel(id: string) {
  return await query(`DELETE FROM messages WHERE id=?`, [id]);
}

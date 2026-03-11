import { query } from "../../utils/db.js";

export async function getMessageModel(id: string) {
  return await query(`SELECT * FROM messages WHERE id=? LIMIT 1`, [id]);
}

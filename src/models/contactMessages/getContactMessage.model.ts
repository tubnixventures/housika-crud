import { query } from "../../utils/db.js";

export async function getContactMessageModel(id: string) {
  return await query(`SELECT * FROM contact_messages WHERE id=? LIMIT 1`, [id]);
}

import { query } from "../../utils/db.js";

export async function deleteContactMessageModel(id: string) {
  return await query(`DELETE FROM contact_messages WHERE id=?`, [id]);
}

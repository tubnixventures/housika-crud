import { query } from "../../utils/db.js";

export async function deleteUserModel(id: string) {
  return await query(`DELETE FROM users WHERE id=?`, [id]);
}

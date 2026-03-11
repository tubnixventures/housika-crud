import { query } from "../../utils/db.js";
export async function deleteUserModel(id) {
    return await query(`DELETE FROM users WHERE id=?`, [id]);
}

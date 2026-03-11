import { query } from "../../utils/db.js";
export async function getPropertyModel(id) {
    return await query(`SELECT * FROM properties WHERE id=? LIMIT 1`, [id]);
}

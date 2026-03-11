import { query } from "../../utils/db.js";
export async function getPaymentModel(id) {
    return await query(`SELECT * FROM payments WHERE id=? LIMIT 1`, [id]);
}

import { query } from "../../utils/db.js";
export async function deletePaymentModel(id) {
    return await query(`DELETE FROM payments WHERE id=?`, [id]);
}

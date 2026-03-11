import { query } from "../../utils/db.js";
export async function deleteBannerModel(id) {
    return await query(`DELETE FROM banners WHERE id=?`, [id]);
}

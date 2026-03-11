import { query } from "../../utils/db.js";
export async function getBannerModel(id) {
    return await query(`SELECT * FROM banners WHERE id=? LIMIT 1`, [id]);
}

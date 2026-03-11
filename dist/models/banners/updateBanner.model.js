import { query } from "../../utils/db.js";
import { BannerSchema } from "./banner.schema.js";
export async function updateBannerModel(id, updates) {
    const parsed = BannerSchema.partial().parse(updates);
    const fields = Object.keys(parsed).map((k) => `${k}=?`).join(", ");
    const values = Object.values(parsed);
    return await query(`UPDATE banners SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [...values, id]);
}

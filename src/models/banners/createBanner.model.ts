import { query } from "../../utils/db.js";
import { BannerSchema, type BannerType } from "./banner.schema.js";

export async function createBannerModel(banner: BannerType) {
  const parsed = BannerSchema.parse(banner);
  return await query(
    `INSERT INTO banners (id, title, description, image_url, video_url, is_active, start_at, ends_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      parsed.id,
      parsed.title,
      parsed.description,
      parsed.image_url,
      parsed.video_url,
      parsed.is_active,
      parsed.start_at,
      parsed.ends_at,
    ]
  );
}

import { query } from "../../utils/db.js";
import { z } from "zod";

const PropertyUpdateSchema = z.object({
  landlord_id: z.string().uuid().optional(),
  units_available: z.number().int().nonnegative().optional(),
  active_units: z.number().int().nonnegative().optional(),
  occupied_units: z.number().int().nonnegative().optional(),
  video_urls: z.string().optional(),
  image_urls: z.string().optional(),
  description: z.string().max(1000).optional(),
  country: z.string().min(2).max(50).optional(),
  currency: z.string().min(1).max(10).optional(),
  location: z.string().min(1).max(100).optional(),
  exact_location: z.string().max(200).optional(),
});

export async function updatePropertyModel(id: string, updates: any) {
  const parsed = PropertyUpdateSchema.parse(updates);
  if (Object.keys(parsed).length === 0) return;

  const fields = Object.keys(parsed).map((k) => `${k}=?`).join(", ");
  const values = Object.values(parsed);

  return await query(
    `UPDATE properties SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [...values, id]
  );
}

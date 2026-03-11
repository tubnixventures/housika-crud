import { query } from "../../utils/db.js";
import { z } from "zod";
const PropertySchema = z.object({
    id: z.string().uuid(),
    landlord_id: z.string().uuid(),
    units_available: z.number().int().nonnegative(),
    active_units: z.number().int().nonnegative(),
    occupied_units: z.number().int().nonnegative(),
    video_urls: z.string().optional(),
    image_urls: z.string().optional(),
    description: z.string().max(1000).optional(),
    country: z.string().min(2).max(50),
    currency: z.string().min(1).max(10),
    location: z.string().min(1).max(100),
    exact_location: z.string().max(200).optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    // rooms handled separately in controller
});
export async function createPropertyModel(property) {
    const parsed = PropertySchema.parse(property);
    return await query(`INSERT INTO properties (id, landlord_id, units_available, active_units, occupied_units, video_urls, image_urls, description, country, currency, location, exact_location, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [
        parsed.id,
        parsed.landlord_id,
        parsed.units_available,
        parsed.active_units,
        parsed.occupied_units,
        parsed.video_urls,
        parsed.image_urls,
        parsed.description,
        parsed.country,
        parsed.currency,
        parsed.location,
        parsed.exact_location,
    ]);
}

import { query } from "../../utils/db.js";
import { z } from "zod";

const RoomSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  room_number: z.string().min(1).max(50),
  category: z.string().min(1).max(50),
  currency: z.string().min(1).max(10),
  country: z.string().min(2).max(50),
  location: z.string().min(1).max(100),
  exact_location: z.string().max(200).optional(),
  amount: z.number().nonnegative(),
  period: z.string().min(1).max(50),
  is_occupied: z.boolean().default(false),
  start_at: z.date().optional(),
  ends_at: z.date().optional(),
  image_urls: z.string().optional(),
  video_urls: z.string().optional(),
  capacity: z.number().int().nonnegative(),
  amenities: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type RoomType = z.infer<typeof RoomSchema>;

export async function createRoomModel(room: RoomType) {
  const parsed = RoomSchema.parse(room);
  return await query(
    `INSERT INTO rooms (id, property_id, room_number, category, currency, country, location, exact_location, amount, period, is_occupied, start_at, ends_at, image_urls, video_urls, capacity, amenities, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      parsed.id,
      parsed.property_id,
      parsed.room_number,
      parsed.category,
      parsed.currency,
      parsed.country,
      parsed.location,
      parsed.exact_location,
      parsed.amount,
      parsed.period,
      parsed.is_occupied,
      parsed.start_at,
      parsed.ends_at,
      parsed.image_urls,
      parsed.video_urls,
      parsed.capacity,
      parsed.amenities,
    ]
  );
}

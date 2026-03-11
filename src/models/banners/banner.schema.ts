import { z } from "zod";

export const BannerSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  image_url: z.string().url().optional(),
  video_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
  start_at: z.date().optional(),
  ends_at: z.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type BannerType = z.infer<typeof BannerSchema>;

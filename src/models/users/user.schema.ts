import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["ceo", "admin", "customer_care", "user"]),
  permissions: z.string().optional(),
  email: z.string().email(),
  phone_number: z.string().min(7).max(15),
  password_hash: z.string().min(60).max(100), // bcrypt hash length
  is_verified: z.boolean().default(false),
  display_name: z.string().min(1).max(100),
  country: z.string().min(2).max(50),
  timezone: z.string().min(1).max(50),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type UserType = z.infer<typeof UserSchema>;

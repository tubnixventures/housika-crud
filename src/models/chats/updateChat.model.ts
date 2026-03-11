import { query } from "../../utils/db.js";
import { z } from "zod";

const ChatUpdateSchema = z.object({
  property_id: z.string().uuid().optional(),
  room_number: z.string().optional(),
  landlord_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
});

export async function updateChatModel(id: string, updates: any) {
  const parsed = ChatUpdateSchema.parse(updates);
  const fields = Object.keys(parsed).map((k) => `${k}=?`).join(", ");
  const values = Object.values(parsed);

  return await query(
    `UPDATE chats SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [...values, id]
  );
}

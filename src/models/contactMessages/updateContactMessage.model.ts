import { query } from "../../utils/db.js";
import { z } from "zod";

const ContactMessageUpdateSchema = z.object({
  replies: z.string().optional(),
  agent_id: z.string().uuid().optional(),
  status: z.string().optional(),
});

export async function updateContactMessageModel(id: string, updates: any) {
  const parsed = ContactMessageUpdateSchema.parse(updates);
  const fields = Object.keys(parsed).map((k) => `${k}=?`).join(", ");
  const values = Object.values(parsed);

  return await query(
    `UPDATE contact_messages SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [...values, id]
  );
}

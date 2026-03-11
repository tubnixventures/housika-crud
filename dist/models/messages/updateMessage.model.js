import { query } from "../../utils/db.js";
import { z } from "zod";
const MessageUpdateSchema = z.object({
    content: z.string().optional(),
    attachments: z.string().optional(),
});
export async function updateMessageModel(id, updates) {
    const parsed = MessageUpdateSchema.parse(updates);
    const fields = Object.keys(parsed).map((k) => `${k}=?`).join(", ");
    const values = Object.values(parsed);
    return await query(`UPDATE messages SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [...values, id]);
}

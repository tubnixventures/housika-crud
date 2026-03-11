import { query } from "../../utils/db.js";
import { z } from "zod";
const MessageSchema = z.object({
    id: z.string().uuid(),
    chat_id: z.string().uuid(),
    property_id: z.string().uuid(),
    room_number: z.string().min(1).max(50),
    sender_id: z.string().uuid(),
    content: z.string().min(1).max(2000),
    attachments: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});
export async function createMessageModel(msg) {
    const parsed = MessageSchema.parse(msg);
    return await query(`INSERT INTO messages (id, chat_id, property_id, room_number, sender_id, content, attachments, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [
        parsed.id,
        parsed.chat_id,
        parsed.property_id,
        parsed.room_number,
        parsed.sender_id,
        parsed.content,
        parsed.attachments || null,
    ]);
}

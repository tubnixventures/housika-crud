import { query } from "../../utils/db.js";
import { z } from "zod";
const ChatSchema = z.object({
    id: z.string().uuid(),
    conversation_id: z.string().uuid(),
    property_id: z.string().uuid(),
    room_number: z.string().min(1).max(50),
    landlord_id: z.string().uuid(),
    user_id: z.string().uuid(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});
export async function createChatModel(chat) {
    const parsed = ChatSchema.parse(chat);
    return await query(`INSERT INTO chats (id, conversation_id, property_id, room_number, landlord_id, user_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [
        parsed.id,
        parsed.conversation_id,
        parsed.property_id,
        parsed.room_number,
        parsed.landlord_id,
        parsed.user_id,
    ]);
}

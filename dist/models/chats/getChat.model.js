import { query } from "../../utils/db.js";
export async function getChatModel(id, limit = 30, offset = 0) {
    // Fetch chat metadata
    const chatResult = await query(`SELECT * FROM chats WHERE id = ? LIMIT 1`, [id]);
    const chat = chatResult.rows[0];
    if (!chat)
        return { chat: null, messages: [] };
    // Fetch messages tied to chat with pagination
    const messagesResult = await query(`SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC LIMIT ? OFFSET ?`, [id, limit, offset]);
    return {
        chat,
        messages: messagesResult.rows || [],
    };
}

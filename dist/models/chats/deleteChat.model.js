import { query } from "../../utils/db.js";
export async function deleteChatModel(chatId, userId) {
    // Fetch chat
    const chatResult = await query(`SELECT * FROM chats WHERE id = ? LIMIT 1`, [chatId]);
    const chat = chatResult.rows[0];
    if (!chat)
        throw new Error("Chat not found");
    // Ensure requester is participant
    if (chat.user_id !== userId && chat.landlord_id !== userId) {
        throw new Error("Not authorized to delete this chat");
    }
    // Check if chat already marked deleted by other party
    const deleteFlagColumn = chat.user_id === userId ? "user_deleted" : "landlord_deleted";
    // If both parties deleted → hard delete
    if ((chat.user_deleted && chat.landlord_deleted) ||
        (deleteFlagColumn === "user_deleted" && chat.landlord_deleted) ||
        (deleteFlagColumn === "landlord_deleted" && chat.user_deleted)) {
        // Delete messages first
        await query(`DELETE FROM messages WHERE chat_id = ?`, [chatId]);
        // Delete chat
        await query(`DELETE FROM chats WHERE id = ?`, [chatId]);
        return { chatId, message: "Chat and messages deleted permanently" };
    }
    // Otherwise → mark deleted for this participant
    await query(`UPDATE chats SET ${deleteFlagColumn} = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [chatId]);
    return { chatId, message: "Chat marked deleted for this participant" };
}

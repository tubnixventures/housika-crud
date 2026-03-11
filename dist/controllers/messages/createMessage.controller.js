import { createMessageModel } from "../../models/messages/createMessage.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { query } from "../../utils/db.js";
import { v4 as uuidv4 } from "uuid";
export async function createMessageController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Ensure chat exists
    const chatResult = await query(`SELECT landlord_id, user_id FROM chats WHERE id = ?`, [
        req.body.chat_id,
    ]);
    const chat = chatResult.rows[0];
    if (!chat)
        throw new Error("Chat not found");
    // Allowed roles
    const allowedRoles = ["user", "landlord", "admin", "ceo"];
    if (!allowedRoles.includes(payload.role)) {
        throw new Error("Not authorized to send messages");
    }
    // Only participants or company roles can send
    if (!["admin", "ceo"].includes(payload.role) &&
        payload.id !== chat.user_id &&
        payload.id !== chat.landlord_id) {
        throw new Error("You are not a participant in this chat");
    }
    // Prevent self‑chat (same sender as both participants)
    if (chat.user_id === chat.landlord_id) {
        throw new Error("Invalid chat: user and landlord cannot be the same");
    }
    // Begin transaction
    await query("BEGIN");
    try {
        const messageId = uuidv4();
        req.body.id = messageId;
        req.body.sender_id = payload.id;
        // Insert message
        await createMessageModel(req.body);
        // Update chat metadata
        await query(`UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [req.body.chat_id]);
        // Commit transaction
        await query("COMMIT");
        return { messageId, chatId: req.body.chat_id, status: "Message sent successfully" };
    }
    catch (err) {
        await query("ROLLBACK");
        throw err;
    }
}

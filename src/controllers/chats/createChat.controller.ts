import { createChatModel } from "../../models/chats/createChat.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { query } from "../../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export async function createChatController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Allowed roles
  if (!["user", "landlord", "admin", "ceo"].includes(payload.role)) {
    throw new Error("Not authorized to create chats");
  }

  // Prevent chatting with self
  if (req.body.user_id === req.body.landlord_id) {
    throw new Error("Users cannot chat themselves");
  }

  // Begin transaction
  await query("BEGIN");

  try {
    // Create chat
    const chatId = uuidv4();
    const conversationId = uuidv4();
    req.body.id = chatId;
    req.body.conversation_id = conversationId;

    await createChatModel(req.body);

    // Create initial message if provided
    if (req.body.message && req.body.message.trim() !== "") {
      const messageId = uuidv4();
      await query(
        `INSERT INTO messages (id, chat_id, property_id, room_number, sender_id, content, attachments, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          messageId,
          chatId,
          req.body.property_id,
          req.body.room_number,
          payload.id,
          req.body.message,
          req.body.attachments || null,
        ]
      );
    }

    // Commit transaction
    await query("COMMIT");

    return { chatId, conversationId, message: "Chat created successfully" };
  } catch (err) {
    // Rollback on error
    await query("ROLLBACK");
    throw err;
  }
}

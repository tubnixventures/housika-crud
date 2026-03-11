import { getChatModel } from "../../models/chats/getChat.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";
export async function getChatController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Pagination params
    const limit = parseInt(req.query.limit, 10) || 30;
    const offset = parseInt(req.query.offset, 10) || 0;
    // Fetch chat + messages
    const result = await getChatModel(req.params.id, limit, offset);
    if (!result.chat)
        throw new Error("Chat not found");
    // Allowed company roles
    const companyRoles = ["customer_care", "ceo", "admin"];
    // Authorization: only participants or company roles
    if (!companyRoles.includes(payload.role) &&
        payload.id !== result.chat.user_id &&
        payload.id !== result.chat.landlord_id) {
        throw new Error("Not authorized to view this chat");
    }
    return normalizeResult(result);
}

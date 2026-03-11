import { deleteMessageModel } from "../../models/messages/deleteMessage.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
export async function deleteMessageController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Only sender, landlord, admin, or ceo can delete messages
    if (!["user", "landlord", "admin", "ceo"].includes(payload.role)) {
        throw new Error("Not authorized to delete messages");
    }
    return await deleteMessageModel(req.params.id);
}

import { updateMessageModel } from "../../models/messages/updateMessage.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
export async function updateMessageController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Only sender, landlord, admin, or ceo can update messages
    if (!["user", "landlord", "admin", "ceo"].includes(payload.role)) {
        throw new Error("Not authorized to update messages");
    }
    return await updateMessageModel(req.params.id, req.body);
}

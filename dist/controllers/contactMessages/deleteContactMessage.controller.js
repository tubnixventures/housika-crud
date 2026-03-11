import { deleteContactMessageModel } from "../../models/contactMessages/deleteContactMessage.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
export async function deleteContactMessageController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Only agents, admin, or ceo can delete
    if (!["agent", "admin", "ceo"].includes(payload.role)) {
        throw new Error("Not authorized to delete contact messages");
    }
    return await deleteContactMessageModel(req.params.id);
}

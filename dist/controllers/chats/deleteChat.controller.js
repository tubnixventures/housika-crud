import { deleteChatModel } from "../../models/chats/deleteChat.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { query } from "../../utils/db.js";
export async function deleteChatController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Begin transaction
    await query("BEGIN");
    try {
        const result = await deleteChatModel(req.params.id, payload.id);
        await query("COMMIT");
        return result;
    }
    catch (err) {
        await query("ROLLBACK");
        throw err;
    }
}

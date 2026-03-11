import { createRoomModel } from "../../models/rooms/createRoom.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
export async function createRoomController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Only verified landlords, admin, or ceo can create
    if (payload.role === "user" && !payload.isVerified) {
        throw new Error("Only verified landlords can create rooms");
    }
    return await createRoomModel(req.body);
}

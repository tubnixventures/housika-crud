import { updateRoomModel } from "../../models/rooms/updateRoom.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";

export async function updateRoomController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Only verified landlords, admin, or ceo can update
  if (payload.role === "user" && !payload.isVerified) {
    throw new Error("Only verified landlords can update rooms");
  }

  return await updateRoomModel(req.params.id, req.body);
}

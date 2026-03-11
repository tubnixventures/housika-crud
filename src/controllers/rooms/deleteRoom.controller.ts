import { deleteRoomModel } from "../../models/rooms/deleteRoom.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";

export async function deleteRoomController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Only verified landlords, admin, or ceo can delete
  if (payload.role === "user" && !payload.isVerified) {
    throw new Error("Only verified landlords can delete rooms");
  }

  return await deleteRoomModel(req.params.id);
}

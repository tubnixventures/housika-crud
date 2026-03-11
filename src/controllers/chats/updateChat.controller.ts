import { updateChatModel } from "../../models/chats/updateChat.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";

export async function updateChatController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");
  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Only participants, admin, or ceo can update chats
  if (!["user", "landlord", "admin", "ceo"].includes(payload.role)) {
    throw new Error("Not authorized to update chats");
  }

  return await updateChatModel(req.params.id, req.body);
}

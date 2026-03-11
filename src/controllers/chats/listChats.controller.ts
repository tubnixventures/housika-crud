import { listChatsModel } from "../../models/chats/listChats.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";

export async function listChatsController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Pagination params
  const limit = parseInt(req.query.limit, 10) || 30;
  const offset = parseInt(req.query.offset, 10) || 0;

  // Optional filters
  const propertyId = req.query.property_id || null;
  const roomNumber = req.query.room_number || null;

  // Only participants can list chats (no company/global access)
  const result = await listChatsModel(payload.id, limit, offset, propertyId, roomNumber);

  return normalizeResult(result);
}

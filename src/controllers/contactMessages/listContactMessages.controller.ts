import { listContactMessagesModel } from "../../models/contactMessages/listContactMessages.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";

export async function listContactMessagesController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Secure endpoint: auth retained
  const result = await listContactMessagesModel(30);
  return normalizeResult(result);
}

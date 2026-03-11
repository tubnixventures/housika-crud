import { createReceiptModel } from "../../models/receipts/createReceipt.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";

export async function createReceiptController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Only admin or ceo can create receipts
  if (payload.role !== "admin" && payload.role !== "ceo") {
    throw new Error("Not authorized to create receipts");
  }

  return await createReceiptModel(req.body);
}

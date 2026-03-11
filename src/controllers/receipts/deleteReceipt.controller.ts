import { deleteReceiptModel } from "../../models/receipts/deleteReceipt.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";

export async function deleteReceiptController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Only admin or ceo can delete receipts
  if (payload.role !== "admin" && payload.role !== "ceo") {
    throw new Error("Not authorized to delete receipts");
  }

  return await deleteReceiptModel(req.params.id);
}

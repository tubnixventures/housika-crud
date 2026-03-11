import { createReceiptModel } from "../../models/receipts/createReceipt.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";

export async function createReceiptController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Block only admin, customer care, and ceo
  const blockedRoles = ["admin", "customer_care", "ceo"];
  if (blockedRoles.includes(payload.role)) {
    throw new Error("Not authorized to create receipts");
  }

  // All other authenticated roles (landlords, property owners, etc.) are allowed
  return await createReceiptModel(req.body);
}

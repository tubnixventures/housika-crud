import { deletePaymentModel } from "../../models/payments/deletePayment.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
export async function deletePaymentController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Only admin or ceo can delete payments
    if (payload.role !== "admin" && payload.role !== "ceo") {
        throw new Error("Not authorized to delete payments");
    }
    return await deletePaymentModel(req.params.id);
}

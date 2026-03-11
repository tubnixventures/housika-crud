import { updatePaymentModel } from "../../models/payments/updatePayment.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
export async function updatePaymentController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Only verified users, admin, or ceo can update payments
    if (payload.role === "user" && !payload.isVerified) {
        throw new Error("Only verified users can update payments");
    }
    return await updatePaymentModel(req.params.id, req.body);
}

import { updateBookingModel } from "../../models/bookings/updateBooking.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
export async function updateBookingController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Only verified users, admin, or ceo can update bookings
    if (payload.role === "user" && !payload.isVerified) {
        throw new Error("Only verified users can update bookings");
    }
    return await updateBookingModel(req.params.id, req.body);
}

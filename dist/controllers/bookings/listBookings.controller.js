import { listBookingsModel } from "../../models/bookings/listBookings.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";
export async function listBookingsController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Pagination params from query string (defaults)
    const limit = parseInt(req.query.limit, 10) || 30;
    const offset = parseInt(req.query.offset, 10) || 0;
    // Company roles can see all bookings
    const companyRoles = ["customer_care", "ceo", "admin"];
    let result;
    if (companyRoles.includes(payload.role)) {
        result = await listBookingsModel(limit, offset); // fetch all bookings
    }
    else {
        result = await listBookingsModel(limit, offset, payload.id); // fetch bookings tied to user_id
    }
    return normalizeResult(result);
}

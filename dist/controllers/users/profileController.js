import { getProfileModel } from "../../models/users/profile.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";
export async function profileController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Fetch profile for the authenticated user
    const profile = await getProfileModel(payload.userId, payload.role);
    // Normalize and return safe profile data
    return normalizeResult(profile.rows);
}

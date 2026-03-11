import { updateUserModel } from "../../models/users/updateUser.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { UserSchema } from "../../models/users/user.schema.js";
export async function updateUserController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Parse incoming fields
    const parsed = UserSchema.partial().parse(req.body);
    // Strip forbidden fields
    const { role, permissions, is_verified, created_at, updated_at, ...safeUpdates } = parsed;
    // Role escalation rules
    if (payload.role === "customer_care" && role && role !== "user") {
        throw new Error("Customer Care cannot escalate roles");
    }
    if (payload.role === "admin" && role && (role === "admin" || role === "ceo")) {
        throw new Error("Admin cannot escalate to Admin/CEO");
    }
    return await updateUserModel(req.params.id, safeUpdates, payload.userId);
}

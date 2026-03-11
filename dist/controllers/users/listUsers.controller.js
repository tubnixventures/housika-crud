import { listUsersModel } from "../../models/users/listUsers.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";
export async function listUsersController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload) {
        throw new Error("Invalid token");
    }
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted) {
        throw new Error("Token blacklisted");
    }
    const limit = parseInt(req.query.limit, 10) || 30;
    const offset = parseInt(req.query.offset, 10) || 0;
    const searchRole = req.query.role || null;
    const searchEmail = req.query.email || null;
    const searchName = req.query.display_name || null;
    const users = await listUsersModel(limit, offset, searchRole, searchEmail, searchName);
    const visible = users.rows.filter((u) => {
        switch (payload.role) {
            case "ceo":
                return true;
            case "admin":
                return ["customer_care", "user"].includes(u.role);
            case "customer_care":
                return u.role === "user";
            default:
                return false;
        }
    });
    return normalizeResult(visible);
}

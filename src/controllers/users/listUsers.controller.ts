import { listUsersModel } from "../../models/users/listUsers.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";
import type{ UserRole } from "../../types/userRole.js";

interface TokenPayload {
  id: string;
  role: UserRole;
}

export async function listUsersController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload: TokenPayload | null = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Pagination params
  const limit = parseInt(req.query.limit, 10) || 30;
  const offset = parseInt(req.query.offset, 10) || 0;

  // Optional search filters
  const searchRole = req.query.role || null;
  const searchEmail = req.query.email || null;
  const searchName = req.query.display_name || null;

  const users = await listUsersModel(limit, offset, searchRole, searchEmail, searchName);

  // Role-based visibility enforcement
  const visible = users.rows.filter((u: any) => {
    switch (payload.role) {
      case "ceo":
        // CEO can view all users
        return true;
      case "admin":
        // Admin can view customer_care and user roles
        return ["customer_care", "user"].includes(u.role);
      case "customer_care":
        // Customer Care can only view users
        return u.role === "user";
      default:
        // Other roles cannot list users
        return false;
    }
  });

  return normalizeResult(visible);
}

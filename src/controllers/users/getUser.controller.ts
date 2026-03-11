import { getUserModel } from "../../models/users/getUser.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";

export async function getUserController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Restrict access to company roles only
  if (!["ceo", "admin", "customer_care"].includes(payload.role)) {
    throw new Error("Not authorized to view users");
  }

  const user = await getUserModel(req.params.identifier, payload.userId, payload.role);

  if (user.rows.length) {
    const targetRole = user.rows[0].role;

    // Prevent viewing same-level users
    if (targetRole === payload.role) {
      throw new Error("Cannot view same-level user");
    }

    // Prevent non-CEO roles from viewing CEO
    if (targetRole === "ceo" && payload.role !== "ceo") {
      throw new Error("Cannot view CEO");
    }
  }

  return normalizeResult(user.rows);
}

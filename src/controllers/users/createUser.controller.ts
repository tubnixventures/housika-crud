import { createUserModel } from "../../models/users/createUser.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { UserSchema } from "../../models/users/user.schema.js";
import type{ UserRole } from "../../types/userRole.js";

interface TokenPayload {
  id: string;
  role: UserRole;
}

export async function createUserController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token) as TokenPayload | null;

  if (payload === null) {
    throw new Error("Invalid token");
  }

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) {
    throw new Error("Token blacklisted");
  }

  const parsed = UserSchema.parse(req.body);

  // Role hierarchy enforcement
  if (["user", "landlord", "tenant"].includes(payload.role)) {
    throw new Error("Not authorized to create users");
  }

  if (payload.role === "customer_care") {
    const disallowed: UserRole[] = ["customer_care", "admin", "ceo"];
    if (disallowed.includes(parsed.role)) {
      throw new Error("Customer Care cannot create Admin, CEO, or another Customer Care");
    }
  }

  if (payload.role === "admin") {
    const disallowed: UserRole[] = ["admin", "ceo"];
    if (disallowed.includes(parsed.role)) {
      throw new Error("Admin cannot create Admin or CEO");
    }
  }

  if (payload.role === "ceo" && parsed.role === "ceo") {
    throw new Error("CEO cannot create another CEO");
  }

  return await createUserModel(parsed, payload.id);
}

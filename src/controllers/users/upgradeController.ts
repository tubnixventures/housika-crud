import { upgradeUserModel } from "../../models/users/upgradeUser.model.js";
import { verifyToken, generateToken } from "../../utils/jwt.js";
import { getSession, setSession } from "../../utils/redis.js";
import { v4 as uuidv4 } from "uuid";

export async function upgradeUserController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  const targetRole = req.body.role;
  if (!targetRole) throw new Error("Missing target role");

  // Restrict upgrades to company roles unless CEO
  const companyRoles = ["ceo", "admin", "customer_care"];
  if (companyRoles.includes(targetRole) && payload.role !== "ceo") {
    throw new Error("Only CEO can upgrade to company roles");
  }

  // Perform upgrade
  const result = await upgradeUserModel(payload.userId, payload.role, targetRole);

  // Blacklist current token
  await setSession(`bl_${token}`, "true", 3600); // 1 hour expiry

  // Generate new verification token
  const newToken = generateToken({
    userId: payload.userId,
    role: targetRole,
    isVerified: false,
  });

  // Generate OTP for multi-device verification
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in Redis with short expiry
  await setSession(`otp_${payload.userId}`, otp, 300); // 5 minutes expiry

  return {
    message: "Upgrade initiated. Account marked unverified.",
    newToken,
    otp,
  };
}

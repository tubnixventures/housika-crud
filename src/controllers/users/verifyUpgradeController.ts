import { verifyUpgradeModel } from "../../models/users/verifyUpgrade.model.js";
import { verifyToken, generateToken,  } from "../../utils/jwt.js";
import type{TokenPayload} from '../../types/tokenPayload.js'
import { getSession, deleteSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";

export async function verifyUpgradeController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  const { otp } = req.body;
  if (!otp) throw new Error("Missing OTP");

  // Validate OTP
  const storedOtp = await getSession(`otp_${payload.userId}`);
  if (!storedOtp || storedOtp !== otp) {
    throw new Error("Invalid or expired OTP");
  }

  // Mark account verified
  const result = await verifyUpgradeModel(payload.userId);

  // Ensure role is valid (never null)
  const newRole: TokenPayload["role"] = result.newRole as TokenPayload["role"];

  // Clear OTP
  await deleteSession(`otp_${payload.userId}`);

  // Generate new verified token
  const newToken = generateToken({
    userId: payload.userId,
    role: newRole,
    isVerified: true,
  });

  return normalizeResult({
    message: "Upgrade verified successfully",
    newToken,
    role: newRole,
  });
}

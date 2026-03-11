import { verifyToken } from "../../utils/jwt.js";
import { getSession, setSession } from "../../utils/redis.js";

export async function resendOtpController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  if (payload.isVerified) {
    throw new Error("Account is already verified, no OTP needed");
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in Redis with short expiry
  await setSession(`otp_${payload.userId}`, otp, 300); // 5 minutes expiry

  return {
    message: "New OTP generated successfully",
    otp,
  };
}

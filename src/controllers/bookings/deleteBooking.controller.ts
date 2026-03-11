import { deleteBookingModel } from "../../models/bookings/deleteBooking.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";

export async function deleteBookingController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Only verified users, admin, or ceo can delete bookings
  if (payload.role === "user" && !payload.isVerified) {
    throw new Error("Only verified users can delete bookings");
  }

  return await deleteBookingModel(req.params.id);
}

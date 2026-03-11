import { updateBannerModel } from "../../models/banners/updateBanner.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { BannerSchema } from "../../models/banners/banner.schema.js";

export async function updateBannerController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Only CEO/Admin can update banners
  if (payload.role !== "ceo" && payload.role !== "admin") {
    throw new Error("Not authorized to update banners");
  }

  const parsed = BannerSchema.partial().parse(req.body);
  return await updateBannerModel(req.params.id, parsed);
}

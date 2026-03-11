import { createBannerModel } from "../../models/banners/createBanner.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { BannerSchema } from "../../models/banners/banner.schema.js";
export async function createBannerController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Only CEO/Admin can create banners
    if (payload.role !== "ceo" && payload.role !== "admin") {
        throw new Error("Not authorized to create banners");
    }
    const parsed = BannerSchema.parse(req.body);
    return await createBannerModel(parsed);
}

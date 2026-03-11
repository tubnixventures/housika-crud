import { deleteBannerModel } from "../../models/banners/deleteBanner.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
export async function deleteBannerController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Only CEO/Admin can delete banners
    if (payload.role !== "ceo" && payload.role !== "admin") {
        throw new Error("Not authorized to delete banners");
    }
    return await deleteBannerModel(req.params.id);
}

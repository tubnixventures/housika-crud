import { getBannerModel } from "../../models/banners/getBanner.model.js";
import { normalizeResult } from "../../utils/normalizeResult.js";
export async function getBannerController(req) {
    // Public endpoint: no auth or session checks
    const result = await getBannerModel(req.params.id);
    return normalizeResult(result);
}

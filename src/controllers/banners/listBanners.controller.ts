import { listBannersModel } from "../../models/banners/listBanners.model.js";
import { normalizeResult } from "../../utils/normalizeResult.js";

export async function listBannersController(req: any) {
  // Public endpoint: no auth or session checks
  const result = await listBannersModel(30);
  return normalizeResult(result);
}

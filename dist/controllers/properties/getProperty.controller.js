import { getPropertyModel } from "../../models/properties/getProperty.model.js";
import { normalizeResult } from "../../utils/normalizeResult.js";
export async function getPropertyController(req) {
    // Public endpoint: no auth or session checks
    const result = await getPropertyModel(req.params.id);
    return normalizeResult(result);
}

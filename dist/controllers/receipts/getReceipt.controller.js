import { getReceiptModel } from "../../models/receipts/getReceipt.model.js";
import { normalizeResult } from "../../utils/normalizeResult.js";
export async function getReceiptController(req) {
    // Public endpoint: no auth or session checks
    const result = await getReceiptModel(req.params.id);
    return normalizeResult(result);
}

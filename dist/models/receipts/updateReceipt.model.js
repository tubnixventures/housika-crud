import { query } from "../../utils/db.js";
import { z } from "zod";
const ReceiptUpdateSchema = z.object({
    receipt_number: z.string().min(1).max(100).optional(),
    file_url: z.string().url().optional(),
    amount: z.number().nonnegative().optional(),
    currency: z.string().min(1).max(10).optional(),
    qr_code: z.string().optional(),
    verification_status: z.string().optional(),
    verified_at: z.date().optional(),
    issued_by: z.string().optional(),
    expires_at: z.date().optional(),
});
export async function updateReceiptModel(id, updates) {
    const parsed = ReceiptUpdateSchema.parse(updates);
    const fields = Object.keys(parsed).map((k) => `${k}=?`).join(", ");
    const values = Object.values(parsed);
    return await query(`UPDATE receipts SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [...values, id]);
}

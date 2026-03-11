import { query } from "../../utils/db.js";
import { z } from "zod";

const PaymentUpdateSchema = z.object({
  receipt_id: z.string().uuid().optional(),
  receipt_number: z.string().optional(),
  reference_type: z.string().optional(),
  gateway: z.string().optional(),
  gateway_reference: z.string().optional(),
  amount: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  status: z.string().optional(),
});

export async function updatePaymentModel(id: string, updates: any) {
  const parsed = PaymentUpdateSchema.parse(updates);
  const fields = Object.keys(parsed).map((k) => `${k}=?`).join(", ");
  const values = Object.values(parsed);

  return await query(
    `UPDATE payments SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [...values, id]
  );
}

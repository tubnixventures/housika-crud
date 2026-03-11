import { query } from "../../utils/db.js";

export async function deletePropertyModel(id: string) {
  // Delete receipts tied to property
  await query(`DELETE FROM receipts WHERE property_id = ?`, [id]);

  // Delete payments tied to property
  await query(`DELETE FROM payments WHERE property_id = ?`, [id]);

  // Delete bookings tied to property
  await query(`DELETE FROM bookings WHERE property_id = ?`, [id]);

  // Delete rooms tied to property
  await query(`DELETE FROM rooms WHERE property_id = ?`, [id]);

  // Finally delete property
  return await query(`DELETE FROM properties WHERE id = ?`, [id]);
}

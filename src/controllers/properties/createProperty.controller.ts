import { createPropertyModel } from "../../models/properties/createProperty.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { query } from "../../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export async function createPropertyController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Allowed roles
  const allowedRoles = [
    "landlord",
    "real_estate_company",
    "real_estate_broker",
    "customer_care",
    "ceo",
    "admin",
  ];

  if (!allowedRoles.includes(payload.role)) {
    throw new Error("Role not permitted to create properties");
  }

  // Require verified account for all except admin
  if (payload.role !== "admin" && !payload.isVerified) {
    throw new Error("Only verified accounts can create properties");
  }

  // For non-admin roles, confirm payment exists and is successful
  let payment: any = null;
  if (payload.role !== "admin") {
    const paymentResult = await query(
      `SELECT * FROM payments WHERE id = ? AND status = 'success'`,
      [req.body.payment_id]
    );
    payment = paymentResult.rows[0];
    if (!payment) {
      throw new Error("Payment not confirmed");
    }
  }

  // Begin transaction
  await query("BEGIN");

  try {
    // Create property
    const propertyId = uuidv4();
    req.body.id = propertyId;
    const property = await createPropertyModel(req.body);

    // Insert rooms (array under property)
    if (Array.isArray(req.body.rooms)) {
      for (const room of req.body.rooms) {
        const roomId = uuidv4();
        await query(
          `INSERT INTO rooms (id, property_id, room_number, category, currency, country, location, exact_location, amount, period, is_occupied, start_at, ends_at, image_urls, video_urls, capacity, amenities, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            roomId,
            propertyId,
            room.room_number,
            room.category,
            room.currency,
            room.country,
            room.location,
            room.exact_location,
            room.amount,
            room.period,
            false, // default not occupied
            room.start_at || null,
            room.ends_at || null,
            room.image_urls || null,
            room.video_urls || null,
            room.capacity || null,
            room.amenities || null,
          ]
        );
      }
    }

    // Deactivate payment after property creation (non-admin only)
    let receiptId: string | null = null;
    let receiptNumber: string | null = null;
    if (payload.role !== "admin" && payment) {
      await query(`UPDATE payments SET status = 'consumed' WHERE id = ?`, [req.body.payment_id]);

      // Create receipt
      receiptId = uuidv4();
      receiptNumber = `RCPT-${Date.now()}`;
      await query(
        `INSERT INTO receipts (id, receipt_number, user_id, landlord_id, property_id, payment_id, amount, currency, verification_status, issued_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'verified', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          receiptId,
          receiptNumber,
          payload.id,
          req.body.landlord_id,
          propertyId,
          req.body.payment_id,
          payment.amount,
          payment.currency,
          payload.role,
        ]
      );
    }

    // Commit transaction
    await query("COMMIT");

    return { propertyId, property, receiptId, receiptNumber };
  } catch (err) {
    // Rollback on error
    await query("ROLLBACK");
    throw err;
  }
}

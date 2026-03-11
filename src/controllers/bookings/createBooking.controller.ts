import { createBookingModel } from "../../models/bookings/createBooking.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession, setSession } from "../../utils/redis.js";
import { query } from "../../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export async function createBookingController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Verified users, admin, ceo allowed. Guests get unique session id.
  if (payload.role === "user" && !payload.isVerified) {
    throw new Error("Only verified users can create bookings");
  }

  // Treat missing payload or external flag as guest
  if ((payload as any).role === "guest") {
    const guestSessionId = uuidv4();
    await setSession(`guest_${guestSessionId}`, JSON.stringify({ guest: true }));
    req.body.user_id = guestSessionId;
  }

  // Confirm payment exists and is successful
  const paymentResult = await query(
    `SELECT * FROM payments WHERE id = ? AND status = 'success'`,
    [req.body.payment_id]
  );
  const payment = paymentResult.rows[0];
  if (!payment) {
    throw new Error("Payment not confirmed");
  }

  // Check room status before booking
  const roomResult = await query(`SELECT is_occupied FROM rooms WHERE id = ?`, [req.body.room_id]);
  const room = roomResult.rows[0];
  if (!room) {
    throw new Error("Room not found");
  }
  if (room.is_occupied) {
    throw new Error("Room is already occupied");
  }

  // Begin transaction
  await query("BEGIN");

  try {
    // Create booking
    const booking = await createBookingModel(req.body);

    // Update property and room status
    await query(`UPDATE properties SET occupied_units = occupied_units + 1 WHERE id = ?`, [
      req.body.property_id,
    ]);
    await query(`UPDATE rooms SET is_occupied = TRUE WHERE id = ?`, [req.body.room_id]);

    // Mark payment as consumed
    await query(`UPDATE payments SET status = 'consumed' WHERE id = ?`, [req.body.payment_id]);

    // Create receipt
    const receiptId = uuidv4();
    const receiptNumber = `RCPT-${Date.now()}`;
    await query(
      `INSERT INTO receipts (id, receipt_number, user_id, property_id, room_number, booking_id, payment_id, amount, currency, verification_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        receiptId,
        receiptNumber,
        req.body.user_id,
        req.body.property_id,
        req.body.room_number,
        req.body.id,
        req.body.payment_id,
        payment.amount,
        payment.currency,
      ]
    );

    // Commit transaction
    await query("COMMIT");

    return { booking, receiptId, receiptNumber };
  } catch (err) {
    // Rollback on error
    await query("ROLLBACK");
    throw err;
  }
}

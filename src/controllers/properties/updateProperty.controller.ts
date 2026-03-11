import { updatePropertyModel } from "../../models/properties/updateProperty.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { query } from "../../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export async function updatePropertyController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Allowed company roles
  const companyRoles = ["customer_care", "ceo", "admin"];

  // Ownership check: only landlord who owns property OR company roles can update
  const propertyResult = await query(`SELECT landlord_id FROM properties WHERE id = ?`, [
    req.params.id,
  ]);
  const property = propertyResult.rows[0];
  if (!property) throw new Error("Property not found");

  if (!companyRoles.includes(payload.role) && property.landlord_id !== payload.id) {
    throw new Error("Not authorized to update this property");
  }

  // Begin transaction
  await query("BEGIN");

  try {
    // Update property fields
    await updatePropertyModel(req.params.id, req.body);

    // Handle rooms update if provided
    if (Array.isArray(req.body.rooms)) {
      // Fetch existing rooms for property
      const existingRoomsResult = await query(`SELECT id, room_number FROM rooms WHERE property_id = ?`, [
        req.params.id,
      ]);
      const existingRooms = existingRoomsResult.rows;

      const incomingRoomNumbers = req.body.rooms.map((r: any) => r.room_number);

      // Delete rooms not in incoming list
      for (const room of existingRooms) {
        if (!incomingRoomNumbers.includes(room.room_number)) {
          await query(`DELETE FROM rooms WHERE id = ?`, [room.id]);
        }
      }

      // Upsert incoming rooms
      for (const room of req.body.rooms) {
        // Check if room exists
        const match = existingRooms.find((r: any) => r.room_number === room.room_number);
        if (match) {
          // Update existing room
          await query(
            `UPDATE rooms SET category=?, currency=?, country=?, location=?, exact_location=?, amount=?, period=?, capacity=?, amenities=?, image_urls=?, video_urls=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
            [
              room.category,
              room.currency,
              room.country,
              room.location,
              room.exact_location,
              room.amount,
              room.period,
              room.capacity,
              room.amenities,
              room.image_urls || null,
              room.video_urls || null,
              match.id,
            ]
          );
        } else {
          // Insert new room
          const roomId = uuidv4();
          await query(
            `INSERT INTO rooms (id, property_id, room_number, category, currency, country, location, exact_location, amount, period, is_occupied, capacity, amenities, image_urls, video_urls, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
              roomId,
              req.params.id,
              room.room_number,
              room.category,
              room.currency,
              room.country,
              room.location,
              room.exact_location,
              room.amount,
              room.period,
              false, // default not occupied
              room.capacity,
              room.amenities,
              room.image_urls || null,
              room.video_urls || null,
            ]
          );
        }
      }
    }

    // Commit transaction
    await query("COMMIT");

    return { propertyId: req.params.id, message: "Property and rooms updated successfully" };
  } catch (err) {
    // Rollback on error
    await query("ROLLBACK");
    throw err;
  }
}

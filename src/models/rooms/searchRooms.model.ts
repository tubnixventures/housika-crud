import { query } from "../../utils/db.js";

/**
 * Advanced search for rooms with flexible matching.
 * Supports long text queries by searching across multiple fields.
 */
export async function searchRoomsModel(
  searchText: string,
  limit = 30,
  offset = 0
) {
  // Normalize input
  const term = `%${searchText.trim()}%`;

  return await query(
    `
    SELECT *
    FROM rooms
    WHERE 
      room_number LIKE ? OR
      category LIKE ? OR
      country LIKE ? OR
      location LIKE ? OR
      exact_location LIKE ? OR
      amenities LIKE ? OR
      CAST(amount AS TEXT) LIKE ? OR
      currency LIKE ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
    `,
    [term, term, term, term, term, term, term, term, limit, offset]
  );
}

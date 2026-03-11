import { query } from "../../utils/db.js";
export async function listChatsModel(userId, limit = 30, offset = 0, propertyId, roomNumber) {
    let baseQuery = `
    SELECT c.*, 
           m.id AS last_message_id,
           m.content AS last_message_content,
           m.created_at AS last_message_time
    FROM chats c
    LEFT JOIN LATERAL (
      SELECT id, content, created_at
      FROM messages
      WHERE chat_id = c.id
      ORDER BY created_at DESC
      LIMIT 1
    ) m ON true
    WHERE (c.user_id = ? OR c.landlord_id = ?)
  `;
    const params = [userId, userId];
    if (propertyId) {
        baseQuery += ` AND c.property_id = ?`;
        params.push(propertyId);
    }
    if (roomNumber) {
        baseQuery += ` AND c.room_number = ?`;
        params.push(roomNumber);
    }
    baseQuery += ` ORDER BY c.updated_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    return await query(baseQuery, params);
}

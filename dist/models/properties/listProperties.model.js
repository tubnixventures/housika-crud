import { query } from "../../utils/db.js";
export async function listPropertiesModel(limit = 30, offset = 0, landlordId) {
    if (landlordId) {
        return await query(`SELECT * FROM properties WHERE landlord_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`, [landlordId, limit, offset]);
    }
    return await query(`SELECT * FROM properties ORDER BY created_at DESC LIMIT ? OFFSET ?`, [limit, offset]);
}

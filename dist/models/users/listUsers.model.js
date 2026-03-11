import { query } from "../../utils/db.js";
export async function listUsersModel(limit = 30, offset = 0, role, email, displayName) {
    let baseQuery = `SELECT * FROM users WHERE 1=1`;
    const params = [];
    if (role) {
        baseQuery += ` AND role = ?`;
        params.push(role);
    }
    if (email) {
        baseQuery += ` AND email LIKE ?`;
        params.push(`%${email}%`);
    }
    if (displayName) {
        baseQuery += ` AND display_name LIKE ?`;
        params.push(`%${displayName}%`);
    }
    baseQuery += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    return await query(baseQuery, params);
}

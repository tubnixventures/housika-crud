import { query } from "../../utils/db.js";
import { v4 as uuidv4 } from "uuid";
export async function getProfileModel(userId, actorRole) {
    await query("BEGIN");
    try {
        // Fetch profile, excluding sensitive fields
        const profile = await query(`SELECT id, role, email, phone_number, display_name, country, timezone, is_verified, created_at, updated_at
       FROM users
       WHERE id=? LIMIT 1`, [userId]);
        if (profile.rows.length) {
            const target = profile.rows[0];
            // Insert audit log for PROFILE VIEW
            await query(`INSERT INTO user_audit (
           id, actor_id, target_user_id, action, role_assigned, timestamp, details
         )
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`, [
                uuidv4(),
                userId,
                userId,
                "PROFILE_VIEW",
                target.role,
                JSON.stringify({ actorRole })
            ]);
        }
        await query("COMMIT");
        return profile;
    }
    catch (err) {
        await query("ROLLBACK");
        throw err;
    }
}

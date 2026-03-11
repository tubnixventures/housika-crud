import { query } from "../../utils/db.js";
import { v4 as uuidv4 } from "uuid";
export async function getUserModel(identifier, actorId, actorRole) {
    await query("BEGIN");
    try {
        // Fetch user
        const user = await query(`SELECT * FROM users WHERE id=? OR email=? OR phone_number=? LIMIT 1`, [identifier, identifier, identifier]);
        if (user.rows.length) {
            const target = user.rows[0];
            // Insert audit log for VIEW action
            await query(`INSERT INTO user_audit (
           id, actor_id, target_user_id, action, role_assigned, timestamp, details
         )
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`, [
                uuidv4(),
                actorId,
                target.id,
                "VIEW",
                target.role,
                JSON.stringify({ actorRole, identifier })
            ]);
        }
        await query("COMMIT");
        return user;
    }
    catch (err) {
        await query("ROLLBACK");
        throw err;
    }
}

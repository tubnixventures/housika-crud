import { query } from "../../utils/db.js";
import { v4 as uuidv4 } from "uuid";
export async function verifyUpgradeModel(userId) {
    await query("BEGIN");
    try {
        // Fetch current role
        const current = await query(`SELECT role FROM users WHERE id=?`, [userId]);
        if (current.rows.length === 0)
            throw new Error("User not found");
        const newRole = current.rows[0].role;
        // Mark account verified
        await query(`UPDATE users SET is_verified=true, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [userId]);
        // Insert audit log
        await query(`INSERT INTO user_audit (
         id, actor_id, target_user_id, action, role_assigned, timestamp, details
       )
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`, [
            uuidv4(),
            userId,
            userId,
            "VERIFY_UPGRADE",
            newRole,
            JSON.stringify({ verified: true }),
        ]);
        await query("COMMIT");
        return { userId, newRole };
    }
    catch (err) {
        await query("ROLLBACK");
        throw err;
    }
}

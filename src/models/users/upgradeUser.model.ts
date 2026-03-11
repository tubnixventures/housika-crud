import { query } from "../../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export async function upgradeUserModel(userId: string, oldRole: string, newRole: string) {
  await query("BEGIN");

  try {
    // Update role and mark unverified
    await query(
      `UPDATE users SET role=?, is_verified=false, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [newRole, userId]
    );

    // Insert audit log
    await query(
      `INSERT INTO user_audit (
         id, actor_id, target_user_id, action, role_assigned, timestamp, details
       )
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [
        uuidv4(),
        userId,
        userId,
        "UPGRADE",
        newRole,
        JSON.stringify({ oldRole, newRole }),
      ]
    );

    await query("COMMIT");
    return { userId, newRole };
  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
}

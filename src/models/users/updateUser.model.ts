import { query } from "../../utils/db.js";
import { UserSchema } from "./user.schema.js";
import { v4 as uuidv4 } from "uuid";

export async function updateUserModel(id: string, updates: Partial<any>, actorId: string) {
  const parsed = UserSchema.partial().parse(updates);

  if (Object.keys(parsed).length === 0) {
    throw new Error("No valid fields to update");
  }

  await query("BEGIN");

  try {
    // Fetch current state for audit
    const current = await query(`SELECT * FROM users WHERE id=?`, [id]);
    if (current.rows.length === 0) throw new Error("User not found");

    const before = current.rows[0];

    // Build update statement
    const fields = Object.keys(parsed).map(k => `${k}=?`).join(", ");
    const values = Object.values(parsed);

    await query(
      `UPDATE users SET ${fields}, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [...values, id]
    );

    // Insert audit log with before/after
    await query(
      `INSERT INTO user_audit (
         id, actor_id, target_user_id, action, role_assigned, timestamp, details
       )
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [
        uuidv4(),
        actorId,
        id,
        "UPDATE",
        before.role, // role stays unchanged
        JSON.stringify({ before, after: parsed })
      ]
    );

    await query("COMMIT");
    return { userId: id, message: "User updated successfully" };
  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
}

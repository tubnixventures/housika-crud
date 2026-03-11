import { query } from "../../utils/db.js";
import { UserSchema, type UserType } from "./user.schema.js";
import { v4 as uuidv4 } from "uuid";

export async function createUserModel(user: UserType, actorId: string) {
  const parsed = UserSchema.parse(user);

  await query("BEGIN");

  try {
    // Insert user
    await query(
      `INSERT INTO users (
         id, role, permissions, email, phone_number, password_hash,
         is_verified, display_name, country, timezone, created_at, updated_at
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        parsed.id,
        parsed.role,
        parsed.permissions,
        parsed.email,
        parsed.phone_number,
        parsed.password_hash,
        parsed.is_verified,
        parsed.display_name,
        parsed.country,
        parsed.timezone,
      ]
    );

    // Insert audit log
    await query(
      `INSERT INTO user_audit (
         id, actor_id, target_user_id, action, role_assigned, timestamp, details
       )
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [
        uuidv4(),
        actorId,
        parsed.id,
        "CREATE",
        parsed.role,
        JSON.stringify({ email: parsed.email, country: parsed.country }),
      ]
    );

    await query("COMMIT");
    return { userId: parsed.id, message: "User created successfully" };
  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
}

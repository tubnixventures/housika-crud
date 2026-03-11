import { query } from "../../utils/db.js";
import { z } from "zod";
const ContactMessageSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    phone_number: z.string().optional(),
    subject: z.string().min(1).max(200),
    message: z.string().min(1).max(2000),
    replies: z.string().optional(),
    agent_id: z.string().uuid().optional(),
    status: z.string().min(1).max(50).default("open"),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});
export async function createContactMessageModel(msg) {
    const parsed = ContactMessageSchema.parse(msg);
    return await query(`INSERT INTO contact_messages (id, email, phone_number, subject, message, replies, agent_id, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [
        parsed.id,
        parsed.email,
        parsed.phone_number,
        parsed.subject,
        parsed.message,
        parsed.replies,
        parsed.agent_id,
        parsed.status,
    ]);
}

import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();
async function setup() {
    const db = createClient({
        url: process.env.BUNNY_DB_URL,
        authToken: process.env.BUNNY_DB_TOKEN,
    });
    console.log("Connected to:", process.env.BUNNY_DB_URL);
    try {
        // --- Users ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        role TEXT,
        permissions TEXT,
        email TEXT UNIQUE,
        phone_number TEXT UNIQUE,
        password_hash TEXT,
        is_verified BOOLEAN,
        display_name TEXT,
        country TEXT,
        timezone TEXT,
        last_login TIMESTAMP,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);`);
        // --- Banners ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS banners (
        id UUID PRIMARY KEY,
        title TEXT,
        description TEXT,
        image_url TEXT,
        video_url TEXT,
        is_active BOOLEAN,
        start_at TIMESTAMP,
        ends_at TIMESTAMP,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_banners_start ON banners(start_at);`);
        // --- Properties ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY,
        landlord_id UUID,
        units_available INT,
        active_units INT,
        occupied_units INT,
        video_urls TEXT,
        image_urls TEXT,
        description TEXT,
        country TEXT,
        currency TEXT,
        location TEXT,
        exact_location TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_properties_landlord ON properties(landlord_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_properties_currency ON properties(currency);`);
        // --- Rooms ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY,
        property_id UUID,
        room_number TEXT,
        category TEXT,
        currency TEXT,
        country TEXT,
        location TEXT,
        exact_location TEXT,
        amount DECIMAL,
        period TEXT,
        is_occupied BOOLEAN,
        start_at TIMESTAMP,
        ends_at TIMESTAMP,
        image_urls TEXT,
        video_urls TEXT,
        capacity INT,
        amenities TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_rooms_property ON rooms(property_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_rooms_room_number ON rooms(room_number);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_rooms_occupied ON rooms(is_occupied);`);
        // --- Bookings ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY,
        user_id UUID,
        property_id UUID,
        room_id UUID,
        room_number TEXT,
        payment_id UUID,
        receipt_id UUID,
        receipt_number TEXT,
        start_at TIMESTAMP,
        ends_at TIMESTAMP,
        status TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings(start_at);`);
        // --- Payments ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY,
        user_id UUID,
        booking_id UUID,
        property_id UUID,
        room_number TEXT,
        receipt_id UUID,
        receipt_number TEXT,
        reference_type TEXT,
        gateway TEXT,
        gateway_reference TEXT,
        amount DECIMAL,
        currency TEXT,
        status TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_payments_gateway_ref ON payments(gateway_reference);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_payments_status_gateway ON payments(status, gateway);`);
        // --- Receipts ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS receipts (
        id UUID PRIMARY KEY,
        receipt_number TEXT,
        user_id UUID,
        landlord_id UUID,
        property_id UUID,
        room_number TEXT,
        booking_id UUID,
        payment_id UUID,
        file_url TEXT,
        amount DECIMAL,
        currency TEXT,
        qr_code TEXT,
        verification_status TEXT,
        verified_at TIMESTAMP,
        issued_by TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_receipts_number ON receipts(receipt_number);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_receipts_qr ON receipts(qr_code);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_receipts_verification ON receipts(verification_status);`);
        // --- Chats ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS chats (
        id UUID PRIMARY KEY,
        conversation_id UUID,
        property_id UUID,
        room_number TEXT,
        landlord_id UUID,
        user_id UUID,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_chats_conversation ON chats(conversation_id);`);
        // --- Messages ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY,
        chat_id UUID,
        property_id UUID,
        room_number TEXT,
        sender_id UUID,
        content TEXT,
        attachments TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON messages(chat_id, created_at);`);
        // --- Contact Messages ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY,
        email TEXT,
        phone_number TEXT,
        subject TEXT,
        message TEXT,
        replies TEXT,
        agent_id UUID,
        status TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_contact_messages_agent ON contact_messages(agent_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created ON contact_messages(status, created_at);`);
        // --- User Audit ---
        await db.execute(`
      CREATE TABLE IF NOT EXISTS user_audit (
        id UUID PRIMARY KEY,
        actor_id UUID,
        target_user_id UUID,
        action TEXT,
        role_assigned TEXT,
        timestamp TIMESTAMP,
        details TEXT,
        FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_user_audit_actor ON user_audit(actor_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_user_audit_target ON user_audit(target_user_id);`);
        await db.execute(`CREATE INDEX IF NOT EXISTS idx_user_audit_action ON user_audit(action);`);
        console.log("✅ All Bunny Database tables, foreign keys, and indexes created successfully!");
    }
    catch (err) {
        console.error("❌ Schema setup failed:", err);
        throw err;
    }
}
setup().catch(console.error);

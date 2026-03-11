import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();
export const db = createClient({
    url: process.env.BUNNY_DB_URL,
    authToken: process.env.BUNNY_DB_TOKEN,
});
// Example query wrapper
export async function query(sql, params) {
    return await db.execute({ sql, args: params });
}

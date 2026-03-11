import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();
export const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
});
/**
 * Store session with TTL (default 1 hour).
 * Automatically JSON-stringifies objects for safe storage.
 */
export async function setSession(key, value, ttlSeconds = 3600) {
    const safeValue = typeof value === "string" ? value : JSON.stringify(value);
    await redis.set(key, safeValue, { ex: ttlSeconds });
}
/**
 * Retrieve session value.
 * Automatically parses JSON if possible.
 */
export async function getSession(key) {
    const raw = await redis.get(key);
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return raw;
    }
}
/**
 * Delete session key.
 */
export async function deleteSession(key) {
    await redis.del(key);
}
/**
 * Check if a key exists.
 */
export async function hasSession(key) {
    const exists = await redis.exists(key);
    return exists > 0;
}
/**
 * Increment a counter with TTL (useful for rate limiting).
 */
export async function incrementSession(key, ttlSeconds = 3600) {
    const count = await redis.incr(key);
    if (count === 1) {
        await redis.expire(key, ttlSeconds);
    }
    return count;
}

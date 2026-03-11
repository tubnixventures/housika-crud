import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

/**
 * Store session with TTL (default 1 hour).
 * Automatically JSON-stringifies objects for safe storage.
 */
export async function setSession(
  key: string,
  value: string | object,
  ttlSeconds = 3600
): Promise<void> {
  const safeValue = typeof value === "string" ? value : JSON.stringify(value);
  await redis.set(key, safeValue, { ex: ttlSeconds });
}

/**
 * Retrieve session value.
 * Automatically parses JSON if possible.
 */
export async function getSession<T = string>(key: string): Promise<T | null> {
  const raw = await redis.get<string>(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

/**
 * Delete session key.
 */
export async function deleteSession(key: string): Promise<void> {
  await redis.del(key);
}

/**
 * Check if a key exists.
 */
export async function hasSession(key: string): Promise<boolean> {
  const exists = await redis.exists(key);
  return exists > 0;
}

/**
 * Increment a counter with TTL (useful for rate limiting).
 */
export async function incrementSession(
  key: string,
  ttlSeconds = 3600
): Promise<number> {
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, ttlSeconds);
  }
  return count;
}

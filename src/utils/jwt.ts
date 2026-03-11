// src/utils/jwt.ts
import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import type{ TokenPayload } from "../types/tokenPayload.js";

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET!;

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function decodeToken(token: string): TokenPayload | null {
  return jwt.decode(token) as TokenPayload | null;
}

export function generateToken(payload: TokenPayload, options?: SignOptions): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h", ...options });
}

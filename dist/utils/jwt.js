// src/utils/jwt.ts
import jwt, {} from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
export function decodeToken(token) {
    return jwt.decode(token);
}
export function generateToken(payload, options) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h", ...options });
}

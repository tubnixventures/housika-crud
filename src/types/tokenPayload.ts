// src/types/tokenPayload.ts
import type{ JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;   // match utils/jwt.ts
  role: "ceo" | "admin" | "customer_care" | "user";
  isVerified?: boolean;
}

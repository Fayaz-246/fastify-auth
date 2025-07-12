import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "lololol";
type StringValue = `${number}${"ms" | "s" | "m" | "h" | "d" | "w" | "y"}`;

export function signToken(
  payload: object,
  expiresIn: number | StringValue = "1h"
): string {
  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}

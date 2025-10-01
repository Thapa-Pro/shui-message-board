// Tiny auth helpers: hash passwords and sign/verify JWTs.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";

// hash "abc" -> "$2a$10$..."
export async function hashPassword(plain) {
  return bcrypt.hash(String(plain), 10);
}

// compare "abc" with "$2a$10$..."
export async function checkPassword(plain, hash) {
  return bcrypt.compare(String(plain), String(hash));
}

// make a token like "eyJhbGciOiJIUzI1NiIs..."
export function signToken(username) {
  return jwt.sign({ username }, SECRET, { expiresIn: "7d" });
}

// read and validate "Authorization: Bearer <token>"
export function getUserFromAuthHeader(headers = {}) {
  const value = headers.Authorization || headers.authorization || "";
  const token = value.startsWith("Bearer ") ? value.slice(7) : null;
  if (!token) return null;
  try {
    const data = jwt.verify(token, SECRET);
    return data?.username || null;
  } catch {
    return null;
  }
}

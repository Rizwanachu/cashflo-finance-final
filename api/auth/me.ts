import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../lib/db";
import { users } from "../../shared/models/auth";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      isPro: user.isPro,
      proPlan: user.proPlan
    });
  } catch (e: any) {
    return res.status(401).json({ error: e.message });
  }
}

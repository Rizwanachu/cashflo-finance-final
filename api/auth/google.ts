import type { VercelRequest, VercelResponse } from "@vercel/node";
import { OAuth2Client } from "google-auth-library";
import { db } from "../lib/db";
import { users } from "../../shared/models/auth";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "570018727628-r5tprinrvqhvsgbcpmiai35b7lora5re.apps.googleusercontent.com";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!req.body || !req.body.idToken) {
      return res.status(400).json({ error: "Missing idToken" });
    }

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: req.body.idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    const { email, name, sub: googleId } = payload;
    let [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      const results = await db.insert(users).values({
        email: email,
        password: "GOOGLE_AUTH_" + googleId,
        firstName: name?.split(" ")[0] || "User",
        isPro: false,
        proPlan: "Free"
      }).returning();
      user = results[0];
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json({
      success: true,
      email: payload.email,
      name: payload.name,
      sub: payload.sub,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        isPro: user.isPro,
        proPlan: user.proPlan
      }
    });
  } catch (err: any) {
    console.error("Google auth error:", err);
    return res.status(500).json({
      error: "Google authentication failed",
      message: err.message,
    });
  }
}

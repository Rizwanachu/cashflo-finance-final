import express from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "./db/index.ts";
import { users } from "../shared/models/auth.ts";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  console.log("GIS: Verifying ID token...");

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("No payload from Google");

    const { email, name, sub: googleId, picture } = payload;
    console.log("GIS: Token verified for", email);

    let [user] = await db.select().from(users).where(eq(users.email, email!));

    if (!user) {
      console.log("GIS: Creating new user", email);
      [user] = await db.insert(users).values({
        email: email!,
        password: "GOOGLE_AUTH_EXTERNAL",
        firstName: name?.split(" ")[0] || "User",
        lastName: name?.split(" ").slice(1).join(" ") || null,
        isPro: false,
        proPlan: "Free"
      }).returning();
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName,
        isPro: user.isPro,
        proPlan: user.proPlan
      } 
    });
  } catch (e: any) {
    console.error("GIS: Verification failed", e);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

// Minimal login/register for email
router.post("/login", async (req, res) => {
  // Existing email logic remains for compatibility but GIS is priority
  res.status(501).json({ message: "Use Google Sign-In" });
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json({ 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName,
      isPro: user.isPro,
      proPlan: user.proPlan
    });
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;

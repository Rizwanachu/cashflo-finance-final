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
  
  if (!idToken) {
    return res.status(400).json({ message: "Missing idToken" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("No payload from Google");

    const { email, name } = payload;
    
    if (!email) {
      return res.status(400).json({ message: "Email not provided by Google" });
    }

    let [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      [user] = await db.insert(users).values({
        email: email,
        password: "GOOGLE_AUTH_EXTERNAL_" + Math.random().toString(36),
        firstName: name?.split(" ")[0] || "User",
        isPro: false,
        proPlan: "Free"
      }).returning();
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({ 
      success: true,
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
    console.error("GIS Backend: Verification failed", e.message);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
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

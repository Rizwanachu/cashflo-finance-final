import express from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "./db/index.js";
import { users } from "../shared/models/auth.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const router = express.Router();
const GOOGLE_CLIENT_ID = "570018727628-r5tprinrvqhvsgbcpmiai35b7lora5re.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  
  console.log("GIS Backend: Received POST /api/auth/google");

  if (!idToken) {
    console.error("GIS Backend: Missing idToken");
    return res.status(400).json({ error: "Missing idToken" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("No payload from Google");
    }

    const { email, name, sub: googleId } = payload;
    console.log("GIS Backend: Verified", email);
    
    if (!email) {
      return res.status(400).json({ error: "Email not provided by Google" });
    }

    // Pure JSON approach, check if user exists
    let [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      console.log("GIS Backend: Creating new user", email);
      const results = await db.insert(users).values({
        email: email,
        password: "GOOGLE_AUTH_" + googleId, // Simplified
        firstName: name?.split(" ")[0] || "User",
        isPro: false,
        proPlan: "Free"
      }).returning();
      user = results[0];
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    
    return res.json({ 
      success: true,
      token,
      email: user.email,
      name: user.firstName,
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName,
        isPro: user.isPro,
        proPlan: user.proPlan
      } 
    });
  } catch (e: any) {
    console.error("GIS Backend Error:", e.message);
    return res.status(401).json({ error: e.message });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    if (!user) return res.status(401).json({ error: "User not found" });
    res.json({ 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName,
      isPro: user.isPro,
      proPlan: user.proPlan
    });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
});

export default router;

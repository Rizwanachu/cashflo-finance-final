import express from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "./db/index.ts";
import { users } from "../shared/models/auth.ts";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const router = express.Router();
const client = new OAuth2Client("570018727628-r5tprinrvqhvsgbcpmiai35b7lora5re.apps.googleusercontent.com");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  
  console.log("GIS Backend: Received POST /api/auth/google");
  console.log("GIS Backend: idToken length:", idToken ? idToken.length : 0);
  console.log("GIS Backend: Payload:", JSON.stringify(req.body));

  if (!idToken) {
    console.error("GIS Backend: Missing idToken in request body");
    return res.status(400).json({ success: false, message: "Missing idToken" });
  }

  try {
    console.log("GIS Backend: Verifying token with Google Client ID: 570018727628-r5tprinrvqhvsgbcpmiai35b7lora5re.apps.googleusercontent.com");
    const ticket = await client.verifyIdToken({
      idToken,
      audience: "570018727628-r5tprinrvqhvsgbcpmiai35b7lora5re.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    if (!payload) {
      console.error("GIS Backend: No payload returned from Google verification");
      return res.status(401).json({ success: false, message: "No payload from Google" });
    }

    const { email, name } = payload;
    console.log("GIS Backend: Verification success for email:", email);
    
    if (!email) {
      console.error("GIS Backend: Email not provided in Google payload");
      return res.status(400).json({ success: false, message: "Email not provided by Google" });
    }

    let [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      console.log("GIS Backend: Creating new user for email:", email);
      [user] = await db.insert(users).values({
        email: email,
        password: "GOOGLE_AUTH_EXTERNAL_" + Math.random().toString(36),
        firstName: name?.split(" ")[0] || "User",
        isPro: false,
        proPlan: "Free"
      }).returning();
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    
    console.log("GIS Backend: Successfully authenticated user:", user.email);
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
    console.error("GIS Backend: Verification failed:", e.message, e.stack);
    res.status(401).json({ success: false, message: "Invalid Google token: " + e.message });
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

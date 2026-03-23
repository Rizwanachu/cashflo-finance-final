import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const router = express.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "570018727628-r5tprinrvqhvsgbcpmiai35b7lora5re.apps.googleusercontent.com";
const JWT_SECRET = process.env.JWT_SECRET || "spendory-jwt-secret-change-in-production";

router.post("/google", async (req, res) => {
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

    const userId = `google_${googleId}`;

    const token = jwt.sign(
      { userId, email, name, provider: "google" },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      success: true,
      email,
      name,
      token,
      user: {
        id: userId,
        email,
        firstName: name?.split(" ")[0] || "User",
        isPro: false,
        proPlan: "Free",
      },
    });
  } catch (err: any) {
    console.error("Google auth error:", err);
    return res.status(500).json({
      error: "Google authentication failed",
      message: err.message,
    });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return res.json({
      id: payload.userId,
      email: payload.email,
      firstName: payload.name?.split(" ")[0] || "User",
      isPro: false,
      proPlan: "Free",
    });
  } catch (e: any) {
    return res.status(401).json({ error: e.message });
  }
});

export default router;

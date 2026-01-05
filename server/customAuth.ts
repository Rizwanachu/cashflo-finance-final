import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./db/index.ts";
import { users } from "../shared/models/auth.ts";
import { eq } from "drizzle-orm";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

// Google OAuth Setup
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // STRICTLY use the custom domain callback for production
  // IMPORTANT: Ensure the URL matches exactly what is in Google Cloud Console
  const callbackURL = "https://www.spendorytrack.com/api/auth/google/callback";

  console.log("Setting up Google Strategy. CALLBACK_URL:", callbackURL);

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    proxy: true,
    passReqToCallback: true
  }, async (req, _accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0].value;
      if (!email) {
        console.error("Google OAuth Error: No email found in profile", profile);
        return done(new Error("No email from Google"));
      }

      console.log("Google OAuth SUCCESS: Profile received for", email);

      let [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user) {
        console.log("Google OAuth: Creating new user", email);
        [user] = await db.insert(users).values({
          email,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          firstName: profile.name?.givenName || "User",
          isPro: false,
          proPlan: "Free"
        }).onConflictDoUpdate({
          target: users.email,
          set: {
            firstName: profile.name?.givenName || "User",
            updatedAt: new Date()
          }
        }).returning();
      }
      return done(null, user);
    } catch (e) {
      console.error("Google Strategy Error (Detailed):", e);
      return done(e as Error);
    }
  }));
}

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    done(null, user);
  } catch (e) {
    done(e);
  }
});

router.get("/google", (req, res, next) => {
  console.log("Initiating Google Auth from domain:", req.headers.host);
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  const user = req.user as any;
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  // Redirect back to frontend with token
  res.redirect(`/?token=${token}`);
});

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  console.log("Registration attempt:", { email });
  if (!email || !password) return res.status(400).json({ message: "Missing credentials" });
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null
    }).returning();
    
    console.log("User created:", newUser.id);
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName } });
  } catch (e: any) {
    console.error("Registration error:", e);
    res.status(500).json({ message: e.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email });
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
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
    console.error("Login error:", e);
    res.status(500).json({ message: e.message });
  }
});

// Alias for common login paths or handle legacy redirects
router.get("/login", (req, res) => {
  res.redirect("/");
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

router.post("/pro", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const { isPro, plan } = req.body;
    
    await db.update(users)
      .set({ isPro, proPlan: plan })
      .where(eq(users.id, payload.userId));
      
    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;

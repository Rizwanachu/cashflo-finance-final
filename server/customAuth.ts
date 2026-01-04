import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db/index.ts";
import { users } from "../shared/models/auth.ts";
import { eq } from "drizzle-orm";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

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
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName } });
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
    res.json({ id: user.id, email: user.email, firstName: user.firstName });
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;

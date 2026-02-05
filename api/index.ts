import express from "express";
import session from "express-session";
import passport from "passport";
import connectPg from "connect-pg-simple";
import customAuthRoutes from "./customAuth.ts";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db/index.ts";

const PostgresStore = connectPg(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Database and session setup
app.use(
  session({
    store: new PostgresStore({
      pool: pool,
      tableName: "sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "finance-tracker-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Add CORS/CSP headers for Google Auth
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  
  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Set Cache-Control to prevent heuristic caching issues
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// 1. Explicitly prioritize API routes
app.use("/api/auth", customAuthRoutes);

// Export the app for Vercel
export default app;

async function startServer() {
  // 2. Serve static files
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));

  // 3. Fallback for non-existent API routes (prevents them from hitting SPA logic)
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  // 4. SPA routing (ONLY for HTML requests)
  app.get(/^\/(?!api).*/, (req, res, next) => {
    // If it's a browser asking for a page, send index.html
    if (req.accepts('html')) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });

  const PORT = Number(process.env.PORT) || 3001;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Only start the server if not running on Vercel
if (process.env.NODE_ENV !== "production") {
  startServer().catch(console.error);
}

import express from "express";
import session from "express-session";
import passport from "passport";
import connectPg from "connect-pg-simple";
import customAuthRoutes from "./customAuth.ts";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { pool } from "./db/index.js";

const PostgresStore = connectPg(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Add CORS/CSP headers for Google Auth
  app.use((req, res, next) => {
    // Set security headers to allow Google Identity Services
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });

  // Set Cache-Control to prevent heuristic caching issues
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
  });

  // 1. Explicitly prioritize API routes
  app.use("/api/auth", customAuthRoutes);

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

  const PORT = Number(process.env.PORT) || 5000;
  const httpServer = createServer(app);
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);

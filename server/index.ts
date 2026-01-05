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

  // Set Cache-Control to prevent heuristic caching issues
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
  });

  // Use custom auth routes (Minimal GIS)
  app.use("/api/auth", customAuthRoutes);

  // Serve static files from the Vite build
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));

  // SPA routing: send index.html for all non-API requests
  app.use((req, res, next) => {
    // Exclude /api/auth paths from SPA redirect
    if (req.path.startsWith("/api/auth")) {
      return next();
    }
    // Also handle legacy /api/login and /api/logout for compatibility
    if (req.path === "/api/login" || req.path === "/api/logout") {
      return res.redirect("/");
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  const PORT = Number(process.env.PORT) || 5000;
  const httpServer = createServer(app);
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);

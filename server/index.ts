import express from "express";
import customAuthRoutes from "./customAuth.ts";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    next();
  });

  app.use("/api/auth", customAuthRoutes);

  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));

  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  app.get(/^\/(?!api).*/, (req, res, next) => {
    if (req.accepts("html")) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });

  const PORT = Number(process.env.PORT) || 3001;
  const httpServer = createServer(app);
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);

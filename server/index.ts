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

  // Use custom auth routes
  app.use("/api/auth", customAuthRoutes);

  // Serve static files from the Vite build
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));

  // SPA routing: send index.html for all non-API requests
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
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

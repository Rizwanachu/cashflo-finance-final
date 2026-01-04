import express from "express";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth/index.ts";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Setup Auth (must be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

  // Serve static files from the Vite build
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));

  // Proxy API requests in dev or handle SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const PORT = Number(process.env.PORT) || 5000;
  const httpServer = createServer(app);
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);

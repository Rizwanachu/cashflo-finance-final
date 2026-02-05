import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/models/auth.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

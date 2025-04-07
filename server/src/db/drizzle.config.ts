import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schemas/index.js",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "NewPassword",
    database: "blog",
  },
  verbose: true,
  strict: true,
});

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const migrationClient = new Pool({ connectionString: process.env.DB_URL });
  const db = drizzle(migrationClient);

  console.log("Starting migration...");

  await migrate(db, {
    migrationsFolder: "./src/db/migrations",
  });

  console.log("Migration completed.");

  await migrationClient.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

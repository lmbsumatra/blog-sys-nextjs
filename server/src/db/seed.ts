
import { db } from "./db_connection";
import { seeds } from "./seeds";
import { sql, getTableName } from"drizzle-orm";

// all that are commented are not functioning well when added "await" or "promise" for each db.execute, not seeding and 
// when removed, like below, not functioning well too, but there are times that it does seeds
// might use a faker(?) rather so it doesnt get 'duplicate entry' error
// different command for truncating table

// async function resetTables(table) {
//   const tableName = getTableName(table);
//   console.log(`Processing table: ${table} => Resolved name: ${tableName}`);

//   if (!tableName) {
//     console.error(`Error: Table name is undefined for table object:`, table);
//     return;
//   }

//   try {
//     console.log(`Truncating table: ${tableName}...`);

//     db.execute(sql.raw(`SET FOREIGN_KEY_CHECKS = 0`));
//     db.execute(sql.raw(`TRUNCATE TABLE lost_found.${tableName}`));
//     db.execute(sql.raw(`SET FOREIGN_KEY_CHECKS = 1`));
//     console.log(`Table ${tableName} truncated successfully.`);
//   } catch (error) {
//     console.error(`Error truncating table ${tableName}:`, error);
//   }
// }

// (async () => {
//   try {
//     console.log("Starting table reset...");
//     console.log("Schema Tables:", Object.keys(schema));

//     const tables = [
//       schema.foundItemsTable,
//       schema.lostItemsTable,
//       schema.usersTable,
//     ];

//     await Promise.all(tables.map(resetTables));

//     console.log("Seeding database...");
//     seeds.seedUsers();
//     seeds.seedFoundItems();
//     seeds.seedLostItems();
//     console.log("Database reset and seeded successfully!");
//   } catch (error) {
//     console.error("Error resetting and seeding database:", error);
//   } finally {
//     if (db.pool && db.pool.end) {
//       console.log("Closing database connection...");
//       await db.pool.end();
//     } else {
//       console.warn("No valid 'end()' method found for DB connection.");
//     }
//   }
// })();

// nvm, better to seed per table than all at once
// seeds.seedUsers();
// seeds.seedFoundItems();
// seeds.seedLostItems();

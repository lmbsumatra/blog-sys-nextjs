import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { schema } from "./schemas/index";
import { Pool } from"pg";

// di ko alam kung bakit createPool, mas nasanay ako na createConnection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_UN,
  password: process.env.DB_PW,
  database: process.env.DB_DB,
});

export const db = drizzle(pool, {
  schema,
  // mode: "default", // mode warning: resolved: if schema is passed, should have mode: default/nalimutan ko
});


import express from "express";

// const router = express.Router();

import app from "express";

import { db } from "../db/db_connection";
import { schema } from "../db/schemas/index";

export default { app, db, schema, express }

import { ValidCategory } from "../types/type";

export const validCategories: ValidCategory[] = [
  "Personal",
  "Electronics",
  "Gadgets",
  "Documents",
  "ID",
  "Wearables",
  "Accessories",
  "Clothing",
  "School Materials",
  "Others",
];

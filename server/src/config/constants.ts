import express from "express";

// const router = express.Router();

import app from "express";

import { db } from "../db/db_connection";
import { schema } from "../db/schemas/index";

export default { app, db, schema, express }

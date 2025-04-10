import { AuthController } from "../controllers/auth/AuthController";
import express, { Response } from "express";

const router = express.Router();
router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);

router.post("/signup", AuthController.signup);

export default router;
import { AuthController } from "../controllers/auth/AuthController";
import express, { Response } from "express";
import { loginLimiter } from "../middlewares/rate-limiters/loginRateLimiter";

const router = express.Router();
router.post('/login', loginLimiter, AuthController.login);

router.post('/logout', AuthController.logout);

router.post("/signup", AuthController.signup);

export default router;
import { AuthController } from "../controllers/auth/AuthController";
import express from "express";
import { loginLimiter } from "../middlewares/rate-limiters/loginRateLimiter";
import passport from "passport";

const router = express.Router();
router.post('/login', loginLimiter, AuthController.login);

router.post('/logout', AuthController.logout);

router.post("/signup", AuthController.signup);

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "http://localhost:3000/login",
    }),
    AuthController.googleCallbackController
);
export default router;
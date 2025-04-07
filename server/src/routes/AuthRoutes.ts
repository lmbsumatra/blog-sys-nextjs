import { AuthController } from "../controllers/auth/AuthController";
import express, { Response } from "express";

const router = express.Router();
router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);

router.post("/signup", AuthController.signup);

router.get("/hello", async (res: Response): Promise<void> => {
    try {
        res.json("why???????");
        return;
    } catch (error: any) {
        res.status(500).json({ error: "Something went wrong" });
        return;
    }
});

export default router;
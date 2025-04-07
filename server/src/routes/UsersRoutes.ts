import express, { Request, Response } from "express";

const router = express.Router();
import { UsersController } from "../controllers/users/UsersController";
import { userAuthentication } from "../middlewares/userAuthentication";

router.get("/", UsersController.getAll);
router.get("/user", userAuthentication, UsersController.getUserById);
router.put("/:id", UsersController.updateById);
router.delete("/:userId", UsersController.deleteUser);

export default router;
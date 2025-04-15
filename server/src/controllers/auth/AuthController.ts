import { signup } from "./createUser";
import { googleCallbackController } from "./googleLogin";
import { login } from "./loginUser";
import { logout } from "./logoutUser";

export const AuthController = { signup, login, logout, googleCallbackController };

import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

router.get("/profile", authMiddleware, userController.getProfile);

export default router;

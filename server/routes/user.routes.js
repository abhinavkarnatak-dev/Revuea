import express from "express";
import {
  getProfileHandler,
  updateProfileHandler,
} from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfileHandler);
router.patch("/update", authMiddleware, updateProfileHandler);

export default router;
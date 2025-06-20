import express from "express";
import {
  signupHandler,
  verifyEmailHandler,
  loginHandler,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signupHandler);
router.post("/verify", verifyEmailHandler);
router.post("/login", loginHandler);

export default router;
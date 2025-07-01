import express from "express";
import { pingHandler } from "../controllers/ping.controllers.js";

const router = express.Router();

router.get("/", pingHandler);

export default router;
import express from "express";
import {
  createFormHandler,
  getUserFormsHandler,
  getFormByIdHandler,
  endFormHandler,
  deleteFormHandler,
  getFormAnalyticsHandler,
  getGeminiSummaryHandler,
} from "../controllers/form.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", authMiddleware, createFormHandler);
router.get("/my-forms", authMiddleware, getUserFormsHandler);
router.get("/:formId", authMiddleware, getFormByIdHandler);
router.patch("/:formId/end", authMiddleware, endFormHandler);
router.delete("/:formId", authMiddleware, deleteFormHandler);
router.get("/:formId/analytics", authMiddleware, getFormAnalyticsHandler);
router.get("/:formId/summary", authMiddleware, getGeminiSummaryHandler);

export default router;
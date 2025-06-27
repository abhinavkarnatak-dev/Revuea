import express from "express";
import {
  createFormHandler,
  getUserFormsHandler,
  getFormByIdHandler,
  endFormHandler,
  deleteFormHandler,
  getFormAnalyticsHandler,
  getGeminiSummaryHandler,
  updateFormHandler,
} from "../controllers/form.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", authMiddleware, createFormHandler);
router.get("/my-forms", authMiddleware, getUserFormsHandler);
router.get("/:formId", getFormByIdHandler);
router.put("/:formId", authMiddleware, updateFormHandler);
router.patch("/:formId/end", authMiddleware, endFormHandler);
router.delete("/:formId", authMiddleware, deleteFormHandler);
router.get("/:formId/analytics", authMiddleware, getFormAnalyticsHandler);
router.get("/:formId/summary", authMiddleware, getGeminiSummaryHandler);

export default router;
import express from "express";
import {
  submitResponseHandler,
  exportResponsesHandler,
} from "../controllers/response.controllers.js";

const router = express.Router();

router.post("/submit/:formId", submitResponseHandler);
router.get("/form/:formId/export", exportResponsesHandler);

export default router;
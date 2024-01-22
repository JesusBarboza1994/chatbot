import express from "express";
import { openAIBeta, textToSpeech } from "./controller.js";

const router = express.Router();
router.get("/test", openAIBeta)
router.get("/speech", textToSpeech)
export default router
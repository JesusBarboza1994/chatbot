import express from "express";
import { openAIBeta, textToSpeech, useFunctionOpenAi } from "./controller.js";

const router = express.Router();
router.get("/test", openAIBeta)
router.get("/speech", textToSpeech)
router.post('/function', useFunctionOpenAi)
export default router
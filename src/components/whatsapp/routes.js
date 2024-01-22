import express from "express";
import { receiveMessages, testWebhook } from "./controller.js";
import { openAIBeta } from "../openai/controller.js";

const router = express.Router();
router.get('/webhook', testWebhook)
router.post('/webhook', receiveMessages)
router.get("/test", openAIBeta)

export default router
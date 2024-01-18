import express from "express";
import { receiveMessages, testWebhook } from "./controller.js";

const router = express.Router();
router.get('/webhook', testWebhook)
router.post('/webhook', receiveMessages)


export default router
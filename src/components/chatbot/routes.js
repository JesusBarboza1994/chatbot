import express from "express";
import { testWebhookWhatsappGetController } from "./controllers/testWebhookWhatsappGetController.js";
import { receiveMessagesFromWhatsappPostController } from "./controllers/receiveMessagesFromWhatsappPostController.js";

const router = express.Router();
router.get("/webhook", testWebhookWhatsappGetController);
router.post("/webhook", receiveMessagesFromWhatsappPostController);
export default router;

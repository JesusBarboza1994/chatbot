import express from "express";
import { testWebhookWhatsappGetController } from "../controllers/testWebhookWhatsappGetController.js";
import { receiveMessagesFromWhatsappPostController } from "../controllers/receiveMessagesFromWhatsappPostController.js";
import { waitForMessage } from "../middlewares/createCompleteMessage.js";

const router = express.Router();
router.get("/webhook/:store", testWebhookWhatsappGetController);
router.post("/webhook/:store", waitForMessage, receiveMessagesFromWhatsappPostController);

router.post('/message', waitForMessage, messageController);

function messageController(req, res) {
  const messageStore = req.messageStore;
  const userId = req.body.userId;
  const fullMessage = messageStore[userId].messages.join(' ');
  console.log(`Respuesta completa para ${userId}: ${fullMessage}`);
  delete messageStore[userId];
  // res.send(`Respuesta completa para ${userId}: ${fullMessage}`)
}

function processMessages(userId, messageStore) {
    const fullMessage = messageStore[userId].messages.join(' ');
    console.log(`Respuesta completa para ${userId}: ${fullMessage}`);

    // Aquí enviarías el mensaje a OpenAI o cualquier lógica de negocio

    // Limpiar después de procesar
    delete messageStore[userId];
}

export default router;


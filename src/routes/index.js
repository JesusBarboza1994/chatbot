import express from 'express';
import whatsapp from '../components/whatsapp/routes.js'
import openai from '../components/openai/routes.js'
import chatbot from '../routes/chatbot.routes.js'
import user from '../routes/user.routes.js'
import router from '../routes/chatbot.routes.js';
import receiveMessagesFromMessengerPostController from '../controllers/receiveMessagesFromMessengerPostController.js';
export const routerV1 = express.Router()
export const routerV2 = express.Router()

// routerV1.use("/whatsapp", whatsapp);
routerV1.use("/openai", openai);
routerV2.use('/whatsapp', chatbot);
routerV2.use('/user', user);
routerV2.post('/messenger/:store', receiveMessagesFromMessengerPostController)

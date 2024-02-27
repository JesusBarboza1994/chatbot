import express from 'express';
import whatsapp from '../components/whatsapp/routes.js';
import openai from '../components/openai/routes.js';
import chatbot from '../components/chatbot/routes.js';

export const routerV1 = express.Router()
export const routerV2 = express.Router()

routerV1.use("/whatsapp", whatsapp);
routerV1.use("/openai", openai);

routerV2.use('/', chatbot);


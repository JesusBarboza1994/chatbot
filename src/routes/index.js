import express from 'express';
import whatsapp from '../components/whatsapp/routes.js';
import openai from '../components/openai/routes.js';
export const routerV1 = express.Router()

routerV1.use("/whatsapp", whatsapp);
routerV1.use("/openai", openai);

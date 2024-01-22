import express from 'express';
import whatsapp from '../components/whatsapp/routes.js';
import openai from '../components/openai/routes.js';
const router = express.Router()

router.use("/whatsapp", whatsapp);
router.use("/openai", openai);
export default router
import express from 'express';
import whatsapp from '../components/whatsapp/routes.js';

const router = express.Router()

router.use("/whatsapp", whatsapp);
export default router
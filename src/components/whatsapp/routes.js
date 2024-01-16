'use sctrict'
const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get('/webhook', controller.testWebhook)
router.post('/webhook', controller.receiveMessages)
module.exports = router;
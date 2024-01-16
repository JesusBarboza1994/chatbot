'use sctrict'

const express = require('express')  
const router = express.Router()

const whatsapp = require('../components/whatsapp/routes.js')

router.use("/whatsapp", whatsapp);
module.exports = router
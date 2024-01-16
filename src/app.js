'use sctrict'
const express = require('express')
const cors = require('cors')
const app = express()
const helmet = require('helmet')
const router = require('./routes')

// require('./database/config.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(helmet());

app.use("/", router);
app.get('/', function (req, res) {
    res.send("");
});

module.exports = app
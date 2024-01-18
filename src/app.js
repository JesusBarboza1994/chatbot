import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import router from './routes/index.js'

const app = express()
// require('./database/config.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(helmet());

app.use("/", router);
app.get('/', function (req, res) {
    res.send("");
});

export default app
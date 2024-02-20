import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { routerV1 } from './routes/index.js'
import { connectDatabase } from './database/config.js'

const app = express()
await connectDatabase()
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(helmet());

app.use("/v1", routerV1);
// app.use('/v2', routerV2);
app.get('/', function (req, res) {
    res.send("");
});

export default app
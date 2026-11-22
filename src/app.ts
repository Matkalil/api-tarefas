import express from 'express';
import tarefasV1 from './routes/v1/tarefas.routes.js';
import { logger } from './middlewares/logger.js';

const app = express();

//Middlewares
app.use(express.json());
app.use(logger);


app.use('/api/v1/tarefas', tarefasV1);

export default app;
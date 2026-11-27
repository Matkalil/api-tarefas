import express from 'express';
import tarefasV1 from './routes/v1/tarefas.routes.js';
import tarefasV2 from './routes/v2/tarefas.routes.js';
import { logger } from './middlewares/logger.js';
import { naoEncontrado, tratarErros } from './middlewares/erros.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(logger);

// aviso de descontinuação da v1
app.use('/api/v1', (req, res, next) => {
    res.set('Deprecation', 'true');
    res.set('Sunset', 'Wed, 30 Jun 2027 23:59:59 GMT');
    next();
});

app.use('/api/v1/tarefas', tarefasV1);
app.use('/api/v2/tarefas', tarefasV2);
app.use(naoEncontrado);
app.use(tratarErros);

export default app;

import express from 'express';
import type { Request, Response } from 'express';
import type { Tarefa, NovaTarefa, AtualizarTarefa, SubstituirTarefa } from './tarefas.js';
import { logger } from './middlewares/logger.js';
import { validarTarefa } from './middlewares/validarTarefa.js';

let tarefas: Tarefa[] = [
    { id: 1, titulo: 'Estudar Express', concluida: false },
];
let proximoId = 2;
const NAO_ENC = { erro: 'Tarefa não encontrada' };

type ReqId = Request<{ id: string }>;
type ReqFiltro = Request<{}, {}, {}, { concluida?: string }>;
type ReqCriar = Request<{}, {}, NovaTarefa>;
type ReqAtualizar = Request<{ id: string }, {}, AtualizarTarefa>;
type ReqSubstituir = Request<{ id: string }, {}, SubstituirTarefa>;

const app = express();
const PORT = 3000;

//Middlewares
app.use(express.json());
app.use(logger);

//GET /tarefas?concluidas=true
app.get('/tarefas', (req: ReqFiltro, res: Response<Tarefa[]>) => {
    const { concluida } = req.query;
    if (concluida === undefined) return res.json(tarefas);
    const filtro = concluida === 'true';
    res.json(tarefas.filter((t) => t.concluida === filtro));
});

//GET /tarefas/:id
app.get('/tarefas/:id', (req: ReqId, res: Response) => {
    const id = Number(req.params.id);
    const tarefa = tarefas.find((t) => t.id === id);
    if (!tarefa) return res.status(404).json(NAO_ENC);
    res.json(tarefa);
});

//POST /tarefas
app.post('/tarefas', validarTarefa, (req: ReqCriar, res: Response) => {
    const { titulo } = req.body ?? {};
    if (!titulo) {
        return res.status(400).json({ erro: 'titulo é obrigatório' });
    }
    const novaTarefa: Tarefa = {
        id: proximoId++,
        titulo,
        concluida: false,
    };
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

//PATCH /tarefas/:id
app.patch('/tarefas/:id', (req: ReqAtualizar, res: Response) => {
    const id = Number(req.params.id);
    const i = tarefas.findIndex((t) => t.id === id);
    const atual = tarefas[i]; //Tarefa | undefined
    if (!atual) return res.status(404).json(NAO_ENC);
    tarefas[i] = { ...atual, ...req.body, id };
    res.json(tarefas[i]);
});

//DELETE /tarefas/:id
app.delete('/tarefas/:id', (req: ReqId, res: Response) => {
    const id = Number(req.params.id);
    if (!tarefas.some((t) => t.id === id)) return res.status(404).json(NAO_ENC);
    tarefas = tarefas.filter((t) => t.id !== id);
    res.sendStatus(204);
});

//PUT/tarefas/:id
app.put('/tarefas/:id', validarTarefa, (req: ReqAtualizar, res: Response) => {
    const id = Number(req.params.id);
    const { titulo, concluida } = req.body ?? {};
    if ( typeof titulo !== 'string' || typeof concluida !== 'boolean') {
        return res
        .status(400)
        .json({ erro: 'título (string) e concluida (boolean) são obrigatórios'});
    }
    
    const i= tarefas.findIndex((t) => t.id === id);
    if (i === -1) return res.status(404).json(NAO_ENC);
    
    const tarefaSubstituida: Tarefa = {id, titulo, concluida };
    tarefas[i] = tarefaSubstituida;
    res.status(200).json(tarefaSubstituida);
    }
);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

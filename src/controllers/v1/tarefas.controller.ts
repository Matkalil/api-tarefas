import type { Request, Response } from 'express';
import type {
    AtualizarTarefa,
    NovaTarefa,
    SubstituirTarefa,
    Tarefa,
} from '../../types/tarefas.js';
import { tarefas } from '../../data/tarefas.js';

let proximoId = 2;
const NAO_ENC = { erro: 'Tarefa não encontrada' };

type ReqId = Request<{ id: string }>;
type ReqFiltro = Request<{}, {}, {}, { concluida?: string }>;
type ReqCriar = Request<{}, {}, NovaTarefa>;
type ReqAtualizar = Request<{ id: string }, {}, AtualizarTarefa>;
type ReqSubstituir = Request<{ id: string }, {}, SubstituirTarefa>;

//GET /tarefas?concluidas=true
export function listar(req: ReqFiltro, res: Response<Tarefa[]>) {
    const { concluida } = req.query;
    if (concluida === undefined) return res.json(tarefas);
    const filtro = concluida === 'true';
    res.json(tarefas.filter((t) => t.concluida === filtro));
}

//GET /tarefas/:id
export function buscarPorId(req: ReqId, res: Response) {
    const id = Number(req.params.id);
    const tarefa = tarefas.find((t) => t.id === id);
    if (!tarefa) return res.status(404).json(NAO_ENC);
    res.json(tarefa);
}

//POST /tarefas
export function criar(req: ReqCriar, res: Response) {
    const { titulo } = req.body;
    const novaTarefa: Tarefa = {
        id: proximoId++,
        titulo: titulo.trim(),
        concluida: false,
    };
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
}

//PATCH /tarefas/:id
export function atualizar(req: ReqAtualizar, res: Response) {
    const id = Number(req.params.id);
    const i = tarefas.findIndex((t) => t.id === id);
    const atual = tarefas[i]; //Tarefa | undefined
    if (!atual) return res.status(404).json(NAO_ENC);

    const { titulo, concluida } = req.body;
    tarefas[i] = {
        ...atual,
        ...(titulo !== undefined && { titulo: titulo.trim() }),
        ...(concluida !== undefined && { concluida }),
    };
    res.json(tarefas[i]);
}

//DELETE /tarefas/:id
export function remover(req: ReqId, res: Response) {
    const id = Number(req.params.id);
    if (!tarefas.some((t) => t.id === id)) return res.status(404).json(NAO_ENC);
    tarefas.splice(
        tarefas.findIndex((t) => t.id === id),
        1,
    );
    res.sendStatus(204);
}

import type { Request, Response } from 'express';
import { tarefas } from '../../data/tarefas.js';
import type { Tarefa, RespostaPaginada } from '../../types/tarefas.js';

type Query = { pagina?: string; limite?: string };

export function listar(
    req: Request<{}, {}, {}, Query>,
    res: Response<RespostaPaginada<Tarefa>>,
) {
    const pagina = Number(req.query.pagina ?? 1);
    const limite = Number(req.query.limite ?? 10);
    const inicio = (pagina - 1) * limite;
    res.json({
        dados: tarefas.slice(inicio, inicio + limite),
        meta: { pagina, limite, total: tarefas.length },
    });
}

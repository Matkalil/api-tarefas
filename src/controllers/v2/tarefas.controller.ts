import type { Request, Response } from 'express'
import type { AtualizarTarefa, NovaTarefa, SubstituirTarefa, Tarefa, RespostaPaginada } from '../../types/tarefas.js'
import { tarefas } from '../../data/tarefas.js'

let proximoId = 2
const NAO_ENC = { erro: 'Tarefa não encontrada' }

type Query = { pagina?: string; limite?: string, concluida?: string, busca?: string}

type ReqId = Request<{ id: string }>
type ReqFiltro = Request<{}, {}, {}, Query>
type ReqCriar = Request<{}, {}, NovaTarefa>
type ReqAtualizar = Request<{ id: string }, {}, AtualizarTarefa>
type ReqSubstituir = Request<{ id: string }, {}, SubstituirTarefa>

// GET /tarefas?pagina=10&limite=10&concluida=true
export function listar(req: ReqFiltro, res: Response<RespostaPaginada<Tarefa>>) {
    const { concluida, busca } = req.query
    const pagina = Number(req.query.pagina ?? 1)
    const limite = Number(req.query.limite ?? 10)
    const inicio = (pagina - 1) * limite

    if (concluida === undefined || busca === undefined) {
        return res.json({
            dados: tarefas.slice(inicio, inicio + limite),
            meta: { pagina, limite, total: tarefas.length}
        })
    }

    if (!busca){
        const tarefasFiltroBusca = tarefas.filter((t) => t.titulo.includes(busca))

        res.json({
            dados: tarefasFiltroBusca.slice(inicio, inicio + limite),
            meta: { pagina, limite, total: tarefasFiltroBusca.length}
        })
    }

    const filtro = concluida === 'true'
    const tarefasFiltro = tarefas.filter((t) => t.concluida === filtro)

    return res.json({
            dados: tarefasFiltro.slice(inicio, inicio + limite),
            meta: { pagina, limite, total: tarefasFiltro.length}
        })
}

// GET /tarefas/:id
export function buscarPorId(req: ReqId, res: Response) {
    const id = Number(req.params.id)
    const tarefa = tarefas.find((t) => t.id === id)
    if (!tarefa) return res.status(404).json(NAO_ENC)
    res.json(tarefa)
}

// POST /tarefas
export function criar(req: ReqCriar, res: Response) {
    const { titulo } = req.body ?? {}
    if (!titulo) {
        return res.status(400)
            .json({ erro: 'título é obrigatório' })
    }
    const novaTarefa: Tarefa = {
        id: proximoId++, titulo, concluida: false
    }
    tarefas.push(novaTarefa)
    res.status(201).json(novaTarefa)
}

// PATCH /tarefas/:id
export function atualizar(req: ReqAtualizar, res: Response) {
    const id = Number(req.params.id)
    const i = tarefas.findIndex((t) => t.id === id)
    const atual = tarefas[i]
    if (!atual) return res.status(404).json(NAO_ENC)
    tarefas[i] = { ...atual, ...req.body, id }
    res.json(tarefas[i])
}

// DELETE /tarefas/:id
export function remover(req: ReqId, res: Response) {
    const id = Number(req.params.id)
    if (!tarefas.some((t) => t.id === id)) return res.status(404).json(NAO_ENC)
    tarefas.splice(tarefas.findIndex((t) => t.id === id), 1)
    res.sendStatus(204)
}
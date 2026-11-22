import type { Request, Response, NextFunction } from 'express';

export function validarTarefa(req: Request, res: Response, next: NextFunction) {
    const { titulo, concluida } = req.body ?? {};

    if (req.method === 'POST' && !titulo) {
        return res.status(400).json({ erro: 'titulo é obrigatório' });
    }
    if (
        req.method === 'PATCH' &&
        titulo === undefined &&
        concluida === undefined
    ) {
        return res.status(400).json({ erro: 'informe titulo ou concluida' });
    }
    if (
        titulo !== undefined &&
        (typeof titulo !== 'string' || !titulo.trim())
    ) {
        return res
            .status(400)
            .json({ erro: 'titulo deve ser um texto não vazio' });
    }
    if (concluida !== undefined && typeof concluida !== 'boolean') {
        return res.status(400).json({ erro: 'concluida deve ser booleano' });
    }
    next();
}

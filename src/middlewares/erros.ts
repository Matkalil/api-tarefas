import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    status: number;
    constructor(mensagem: string, status = 400) {
        super(mensagem);
        this.status = status;
    }
}

export function naoEncontrado(req: Request, res: Response) {
    res.status(404).json({ erro: 'Rota não encontrada' });
}

export function tratarErros(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (err instanceof AppError) {
        return res.status(err.status).json({ erro: err.message });
    }
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno' });
}

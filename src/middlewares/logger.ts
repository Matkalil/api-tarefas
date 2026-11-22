import type { Request, Response, NextFunction} from 'express'

export function logger(req: Request, res: Response, next: NextFunction): void{
    const inicio = Date.now();
    res.on('finish', () => { //finish emitido quando resposta é enviada
        const ms = Date.now() - inicio //tempo execução em ms
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`)
    })
    next() //libera requisição
}
import type { Request, Response, NextFunction} from 'express'

export function validarTarefa(req: Request, res: Response, next: NextFunction){
    const titulo: unknown = req.body?.titulo
    const valido = typeof titulo === 'string' && titulo.trim() !== ''
    if(!valido){
       return res.status(400).json({ erro: 'titulo é obrigatório' })
    }
    next() 
}
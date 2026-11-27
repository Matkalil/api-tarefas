import { Router } from 'express';
import * as ctrl from '../../controllers/v2/tarefas.controller.js';
import { validarTarefa } from '../../middlewares/validarTarefa.js';

const router = Router();

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.post('/', validarTarefa, ctrl.criar);
router.patch('/:id', ctrl.atualizar);
router.delete('/:id', ctrl.remover);

export default router;

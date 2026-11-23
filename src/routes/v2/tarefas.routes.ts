import { Router } from 'express';
import * as ctrl from '../../controllers/v2/tarefas.controller.js';

const router = Router();

router.get('/', ctrl.listar);

export default router;
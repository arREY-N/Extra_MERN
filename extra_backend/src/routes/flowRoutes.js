import { Router } from 'express'
import {
    createFlow,
    getFlowById,
    getFlows,
    updateFlow,
    deleteFlow
} from '../controller/flowController.js'

const router = Router();

router.route('/')
    .post(createFlow)
    .get(getFlows);

router.route('/:id')
    .get(getFlowById)
    .put(updateFlow)
    .delete(deleteFlow)

export default router;

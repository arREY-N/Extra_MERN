import { Router } from "express";
import {
    createTransaction,
    getTransactionById,
    getTransactions,
    updateTransaction,
    deleteTransaction
} from '../controller/transactionController.js'

const router = Router();

router.route('/')
    .get(getTransactions)
    .post(createTransaction);

router.route('/:id')
    .get(getTransactionById)
    .put(updateTransaction)
    .delete(deleteTransaction);

export default router;
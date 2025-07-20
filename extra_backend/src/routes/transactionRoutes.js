import { Router } from "express";
import {
    createTransaction,
    getTransactionById,
    getTransactions,
    updateTransaction,
    deleteTransaction
} from '../controller/transactionController.js'
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route('/')
    .get(protect, getTransactions)
    .post(protect, createTransaction);

router.route('/:id')
    .get(protect, getTransactionById)
    .put(protect, updateTransaction)
    .delete(protect, deleteTransaction);

export default router;
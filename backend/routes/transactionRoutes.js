import express from 'express'
import {
  getTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsForPagination,
  // getTransactionsForReports,
} from '../controls/transactionControllers.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()
router.route('/').get(protect, getTransactions).post(protect, addTransaction)
router.route('/pagination').get(protect, getTransactionsForPagination)
// router.route('/reports').get(protect, getTransactionsForReports)
router
  .route('/:id')
  .get(protect, getTransactionById)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction)

export default router

import express from 'express'
import {
  getPumpsForPagination,
  getPumps,
  getPumpById,
  addPump,
  updatePump,
  deletePump,
} from '../controls/pumpControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getPumps).post(protect, admin, addPump)
router.route('/pagination').get(protect, getPumpsForPagination)
router
  .route('/:id')
  .get(protect, admin, getPumpById)
  .put(protect, admin, updatePump)
  .delete(protect, admin, deletePump)

export default router

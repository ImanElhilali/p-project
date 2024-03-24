import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getPumpTypes,
  getPumpTypeById,
  addPumpType,
  updatePumpType,
  deletePumpType,
} from '../controls/pumpTypeControllers.js'

const router = express.Router()

router.route('/').get(protect, getPumpTypes).post(protect, admin, addPumpType)
router
  .route('/:id')
  .get(protect, admin, getPumpTypeById)
  .put(protect, admin, updatePumpType)
  .delete(protect, admin, deletePumpType)

export default router

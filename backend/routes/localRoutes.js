import express from 'express'
import {
  getLocals,
  addLocal,
  updateLocal,
  deleteLocal,
  addUnit,
  getUnits,
  getUnit,
  editUnit,
  deleteUnit,
  getLocal,
} from '../controls/localControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getLocals).post(protect, admin, addLocal)
router
  .route('/:id')
  .get(protect, getLocal)
  .put(protect, admin, updateLocal)
  .delete(protect, admin, deleteLocal)
  .post(protect, admin, addUnit)
router.route('/:id/units').get(protect, getUnits)
router.route('/:id/units/:unitID').get(protect, getUnit)
router.route('/:id/units/:unitID').put(protect, admin, editUnit)
router.route('/:id/units/:unitID').delete(protect, admin, deleteUnit)

export default router

import express from 'express'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getAgentsForPagination,
  getAgents,
  getAgent,
  addAgent,
  deleteAgent,
  updateAgent,
} from '../controls/agentControllers.js'

router.route('/').get(protect, getAgents).post(protect, admin, addAgent)
router.route('/paginate').get(getAgentsForPagination)
router
  .route('/:id')
  .delete(protect, admin, deleteAgent)
  .put(protect, admin, updateAgent)
  .get(protect, admin, getAgent)
export default router

import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getRepository,
  getRepositoryById,
  addRepository,
  updateRepository,
  deleteRepository,
} from '../controls/repositoryControllers.js'

const router = express.Router()

router
  .route('/')
  .get(protect, getRepository)
  .post(protect, admin, addRepository)
router
  .route('/:id')
  .get(protect, admin, getRepositoryById)
  .put(protect, admin, updateRepository)
  .delete(protect, admin, deleteRepository)

export default router

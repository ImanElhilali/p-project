import express from 'express'
import {
  getUsers,
  registerUser,
  updateUser,
  deleteUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
} from '../controls/userControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()

router
  .route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, registerUser)
router.route('/auth').post(authUser)
router.route('/logout').post(logoutUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)

export default router

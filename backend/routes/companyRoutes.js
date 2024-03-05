import express from 'express'
import {
  getCompaniesForPagination,
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  getCompanyById,
} from '../controls/companyControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/').get(protect, getCompanies).post(protect, admin, addCompany)
router.route('/paginate').get(protect, getCompaniesForPagination)
router
  .route('/:id')
  .put(protect, admin, updateCompany)
  .delete(protect, admin, deleteCompany)
  .get(protect, admin, getCompanyById)

export default router

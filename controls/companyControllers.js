import asyncHandler from 'express-async-handler'
import Company from '../models/compayModel.js'

export const getCompaniesForPagination = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT
  const page = Number(req.query.page) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Company.countDocuments({ ...keyword })
  const companies = await Company.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ companies, page, pages: Math.ceil(count / pageSize) })
})
export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find()
  res.json(companies)
})

export const addCompany = asyncHandler(async (req, res) => {
  const { name } = req.body

  if (!name) {
    res.status(400)
    throw new Error('Pleace Enter company name')
  }

  const companyExists = await Company.findOne({ name })

  if (companyExists) {
    res.status(400)
    throw new Error('الاسم موجود مسبقاً')
  } else {
    const createdCompany = await Company.create({ name })
    res.json(createdCompany)
  }
})

export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id)

  if (company) {
    res.json({
      name: company.name,
    })
  } else {
    res.status(404)
    throw new Error('Company not found')
  }
})

export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id)

  if (company) {
    const allCompanies = await Company.find()
    const restOfCompanies = allCompanies.filter(
      (company) => company._id.toString() !== req.params.id
    )

    const doblicatedCompany = restOfCompanies.find(
      (compName) => compName.name === req.body.name
    )

    if (doblicatedCompany) {
      res.status(400)
      throw new Error('الاسم موجود مسبقاً')
    } else {
      const updatedCompany = await Company.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      res.status(200).json({
        updatedCompany,
      })
    }
  } else {
    res.status(404)
    throw new Error('Company not exists')
  }
})

export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id)

  if (company) {
    await Company.deleteOne({ _id: company._id })
    res.json({ message: 'company deleted successfully' })
  } else {
    res.status(404)
    throw new Error('Company not exists')
  }
})

import asyncHandler from 'express-async-handler'
import Transaction from '../models/transactionModel.js'

export const getTransactionsForPagination = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT
  const page = Number(req.query.page) || 1

  const keyword = req.query.keyword
    ? {
        agent: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Transaction.countDocuments({ ...keyword })
  const transactions = await Transaction.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ transactions, page, pages: Math.ceil(count / pageSize) })
})

export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
  res.json(transactions)
})

// export const getTransactionsForReports = asyncHandler(async (req, res) => {
//   const pageSize = process.env.PAGINATION_LIMIT
//   const page = Number(req.query.page) || 1

//   const keyword = req.query.keyword
//     ? {
//         pumpType: {
//           $regex: req.query.keyword,
//           $options: 'i',
//         },
//       }
//     : {}

//   const transactions = await Transaction.find({ ...keyword })
//     .limit(pageSize)
//     .skip(pageSize * (page - 1))
//   res.json({ transactions, page })
// })

export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)

  if (transaction) {
    res.json(transaction)
  } else {
    res.status(404)
    throw new Error('Transaction not found')
  }
})

export const addTransaction = asyncHandler(async (req, res) => {
  const {
    date,
    carNo,
    pumpType,
    pump,
    docType,
    repository,
    company,
    agent,
    local,
    unit,
    approvedQty,
    arrivedQty,
    cost,
    paid,
  } = req.body
  if (
    !date ||
    !carNo ||
    !pumpType ||
    !pump ||
    !docType ||
    !repository ||
    !company ||
    !agent ||
    !local ||
    !unit ||
    !approvedQty ||
    !arrivedQty ||
    !cost ||
    !paid
  ) {
    res.status(400)
    throw new Error('رجاء ادخل كل الحقول')
  }
  const transaction = await Transaction.create(req.body)

  res.json(transaction)
})

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)

  if (transaction) {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.status(200).json(updatedTransaction)
  } else {
    res.status(404)
    throw new Error('Transaction not found')
  }
})

export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)

  if (transaction) {
    await Transaction.deleteOne({ _id: transaction._id })
    res.json({ message: 'Transaction deleted successfully' })
  } else {
    res.status(404)
    throw new Error('Transaction not found')
  }
})

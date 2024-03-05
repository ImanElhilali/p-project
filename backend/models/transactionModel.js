import mongoose from 'mongoose'

const transactionSchema = mongoose.Schema(
  {
    date: {
      type: Date,
    },
    carNo: {
      type: String,
      trim: true,
      required: true,
    },
    pumpType: {
      type: String,
      required: true,
    },
    pump: {
      type: String,
      required: true,
    },
    docType: {
      type: String,
      required: true,
    },
    repository: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    agent: {
      type: String,
      required: true,
    },
    local: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    approvedQty: {
      type: Number,
      required: true,
    },
    arrivedQty: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)
const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction

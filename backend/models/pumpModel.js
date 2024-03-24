import mongoose from 'mongoose'

const pumpSchema = mongoose.Schema(
  {
    pump: {
      type: String,
      trim: true,
      required: true,
    },
    company: {
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
    agent: {
      type: String,
      required: true,
    },
    pumpType: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)
const Pump = mongoose.model('Pump', pumpSchema)
export default Pump

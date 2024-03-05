import mongoose from 'mongoose'

const pumpTypeSchema = mongoose.Schema(
  {
    type: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
)
const PumpType = mongoose.model('PumpType', pumpTypeSchema)
export default PumpType

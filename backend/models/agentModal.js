import mongoose from 'mongoose'

const agentSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    agent: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
)
const Agent = mongoose.model('Agent', agentSchema)
export default Agent

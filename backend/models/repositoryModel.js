import mongoose from 'mongoose'

const repositorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
})
const Repository = mongoose.model('Repository', repositorySchema)
export default Repository

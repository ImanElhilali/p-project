import mongoose from 'mongoose'

const localSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  units: [
    {
      unit: {
        type: String,
        required: true,
      },
    },
  ],
})

const Local = mongoose.model('Local', localSchema)
export default Local

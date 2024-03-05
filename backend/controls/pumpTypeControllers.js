import asyncHandler from 'express-async-handler'
import PumpType from '../models/pumpTypeModel.js'

export const getPumpTypes = asyncHandler(async (req, res) => {
  const types = await PumpType.find()

  res.json(types)
})

export const getPumpTypeById = asyncHandler(async (req, res) => {
  const type = await PumpType.findById(req.params.id)

  if (type) {
    res.json({
      _id: type._id,
      type: type.type,
    })
  } else {
    res.status(404)
    throw new Error('Pump Type is not found')
  }
})

export const addPumpType = asyncHandler(async (req, res) => {
  const { type } = req.body
  const typeExists = await PumpType.findOne({ type })

  if (typeExists) {
    res.status(400)
    throw new Error('نوع الموقود موجود مسبقاً')
  } else {
    const createdType = await PumpType.create({ type })
    res.json({
      _id: createdType._id,
      type: createdType.type,
    })
  }
})

export const updatePumpType = asyncHandler(async (req, res) => {
  const type = await PumpType.findById(req.params.id)

  if (type) {
    const updatedType = await PumpType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedType)
  } else {
    res.status(404)
    throw new Error('الطلمبة غير موجودة')
  }
})

export const deletePumpType = asyncHandler(async (req, res) => {
  const type = await PumpType.findById(req.params.id)

  if (type) {
    await PumpType.deleteOne({ _id: type._id })
    res.json({ message: 'Pump type deleted successfully' })
  } else {
    res.status(404)
    throw new Error('الطلمبة غير موجودة')
  }
})

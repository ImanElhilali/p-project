import asyncHandler from 'express-async-handler'
import Pump from '../models/pumpModel.js'

export const getPumpsForPagination = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT
  const page = Number(req.query.page) || 1

  const keyword = req.query.keyword
    ? {
        pump: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Pump.countDocuments({ ...keyword })
  const pumps = await Pump.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ pumps, page, pages: Math.ceil(count / pageSize) })
})

export const getPumps = asyncHandler(async (req, res) => {
  const pumps = await Pump.find()
  res.json(pumps)
})

export const getPumpById = asyncHandler(async (req, res) => {
  const pump = await Pump.findById(req.params.id)

  if (pump) {
    res.status(200).json(pump)
  } else {
    res.status(404)
    throw new Error('Pump not found')
  }
})

export const addPump = asyncHandler(async (req, res) => {
  const { pump, company, local, unit, agent, pumpType, capacity } = req.body

  const pumpExists = await Pump.findOne({ pump })

  if (pumpExists) {
    res.status(400)
    throw new Error('الطلمبة موجودة مسبقاً')
  } else {
    const createdPump = await Pump.create(req.body)
    res.json(createdPump)
  }
})

export const updatePump = asyncHandler(async (req, res) => {
  const { pump, company, local, unit, agent, pumpType, capacity } = req.body

  const pumpExists = await Pump.findById(req.params.id)

  if (pumpExists) {
    const allPumps = await Pump.find()
    const restOfPumps = allPumps.filter(
      (pump) => pump._id.toString() !== req.params.id
    )

    const doblicatedPump = restOfPumps.find((pum) => pum.pump === req.body.pump)

    if (
      doblicatedPump &&
      doblicatedPump.company === req.body.company &&
      doblicatedPump.local === req.body.local &&
      doblicatedPump.unit === req.body.unit &&
      doblicatedPump.agent === req.body.agent &&
      doblicatedPump.pumpType === req.body.pumpType &&
      doblicatedPump.capacity === req.body.capacity
    ) {
      res.status(400)
      throw new Error('الطلمبة موجودة مسبقاً')
    } else {
      const updatedPump = await Pump.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      )
      res.json(updatedPump)
    }
  } else {
    res.status(404)
    throw new Error('Pump not found')
  }
})

export const deletePump = asyncHandler(async (req, res) => {
  const pump = await Pump.findById(req.params.id)

  if (pump) {
    await Pump.deleteOne({ _id: pump._id })
    res.json({ message: 'Pump deleted successfully' })
  } else {
    res.status(404)
    throw new Error('Pump not fount')
  }
})

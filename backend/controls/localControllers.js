import Local from '../models/localModel.js'
import asyncHandler from 'express-async-handler'

export const getLocals = asyncHandler(async (req, res) => {
  const locals = await Local.find()

  res.json(locals)
})

export const getLocal = asyncHandler(async (req, res) => {
  const local = await Local.findById(req.params.id)

  if (local) {
    res.json(local)
  } else {
    res.status(404)
    throw new Error('Local not found')
  }
})

export const addLocal = asyncHandler(async (req, res) => {
  const { name } = req.body

  const localExists = await Local.findOne({ name })

  if (localExists) {
    res.status(400)
    throw new Error('الاسم موجود مسبقاً')
  } else {
    const local = await Local.create({ name })
    res.status(201).json(local)
  }
})

export const updateLocal = asyncHandler(async (req, res) => {
  const local = await Local.findById(req.params.id)

  if (local) {
    const updatedLocal = await Local.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({
      _id: updatedLocal._id,
      name: updatedLocal.name,
      units: updatedLocal.units,
    })
  } else {
    res.status(400)
    throw new Error("Local dosn't exists")
  }
})

export const deleteLocal = asyncHandler(async (req, res) => {
  const local = await Local.findById(req.params.id)

  if (local) {
    await Local.deleteOne({ _id: local._id })
    res.json({ message: 'Local deleted successfully' })
  } else {
    res.status(400)
    throw new Error('Local not found')
  }
})

export const getUnits = asyncHandler(async (req, res) => {
  const local = await Local.findById(req.params.id)

  if (local) {
    const units = local.units.map((u) => u.unit)
    res.json(units)
  } else {
    res.status(404)
    throw new Error('Local not found')
  }
})
export const getUnit = asyncHandler(async (req, res) => {
  const local = await Local.findById(req.params.id)

  if (local) {
    const unit = local.units.find((u) => u._id.toString() === req.params.unitID)
    if (unit) {
      res.json(unit)
    } else {
      res.status(404)
      throw new Error('Unit not foud')
    }
  } else {
    res.status(404)
    throw new Error('Local not fount')
  }
})
export const addUnit = asyncHandler(async (req, res) => {
  const { unit } = req.body

  const local = await Local.findById(req.params.id)

  if (local) {
    const unitExists = local.units.find((u) => u.unit === unit)

    if (unitExists) {
      res.status(400)
      throw new Error('الاسم موجود مسبقاً')
    } else {
      local.units.push({ unit })
      await local.save()
      res.status(201).json({ message: 'unit added' })
    }
  } else {
    res.status(404)
    throw new Error('Local not found')
  }
})

export const editUnit = asyncHandler(async (req, res) => {
  const { unit } = req.body
  const newUnit = {
    unit,
    _id: req.params.unitID,
  }

  const local = await Local.findById(req.params.id)

  if (local) {
    const unitExists = local.units.find(
      (u) => u._id.toString() === req.params.unitID
    )
    if (unitExists) {
      const unitNameExists = local.units.find((u) => u.unit === unit)
      if (unitNameExists) {
        res.status(400)
        throw new Error('This name already exists in this local')
      } else {
        const updatedUnit = local.units.map((u) =>
          u._id.toString() === req.params.unitID ? newUnit : u
        )
        local.units = updatedUnit
        local.save()
        res.json(local)
      }
    } else {
      res.status(404)
      throw new Error('Unit not found')
    }
  } else {
    res.status(404)
    throw new Error('Local not found')
  }
})

export const deleteUnit = asyncHandler(async (req, res) => {
  const local = await Local.findById(req.params.id)

  if (local) {
    const unitExists = local.units.find(
      (u) => u._id.toString() === req.params.unitID
    )

    if (unitExists) {
      const filteredUnits = local.units.filter(
        (unit) => unit._id.toString() !== req.params.unitID
      )
      local.units = filteredUnits
      local.save()
      res.json({ message: 'Unit deleted successfully' })
    } else {
      res.status(404)
      throw new Error('Unit not found')
    }
  } else {
    res.status(404)
    throw new Error('Local not found')
  }
})

import Repository from '../models/repositoryModel.js'
import asyncHandler from 'express-async-handler'

export const getRepository = asyncHandler(async (req, res) => {
  const repositories = await Repository.find()
  res.json(repositories)
})

export const getRepositoryById = asyncHandler(async (req, res) => {
  const item = await Repository.findById(req.params.id)

  if (item) {
    res.json(item)
  } else {
    res.status(404)
    throw new Error('Repository not found')
  }
})

export const addRepository = asyncHandler(async (req, res) => {
  const { name } = req.body
  const itemExistes = await Repository.findOne({ name })

  if (itemExistes) {
    res.status(404)
    throw new Error('الاسم موجود مسبقاً')
  }
  const addedItem = await Repository.create({ name })
  res.status(201).json(addedItem)
})

export const updateRepository = asyncHandler(async (req, res) => {
  const item = await Repository.findById(req.params.id)

  if (item) {
    const updatedItem = await Repository.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedItem)
  } else {
    res.status(404)
    throw new Error('Repository not found')
  }
})

export const deleteRepository = asyncHandler(async (req, res) => {
  const item = await Repository.findById(req.params.id)

  if (item) {
    await Repository.deleteOne({ _id: item._id })
    res.json({ message: 'Item removed successfully' })
  } else {
    res.status(404)
    throw new Error('Repository not found')
  }
})

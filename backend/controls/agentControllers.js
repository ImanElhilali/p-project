import asyncHandler from 'express-async-handler'
import Agent from '../models/agentModal.js'

export const getAgentsForPagination = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT
  const page = Number(req.query.page) || 1

  const keyword = req.query.keyword
    ? {
        company: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Agent.countDocuments({ ...keyword })
  const agents = await Agent.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ agents, page, pages: Math.ceil(count / pageSize) })
})

export const getAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find()
  res.json(agents)
})

export const getAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id)

  if (agent) {
    res.status(201).json(agent)
  } else {
    res.status(404)
    throw new Error('Agent not found')
  }
})

export const addAgent = asyncHandler(async (req, res) => {
  const { company, agent } = req.body

  if (!company || !agent) {
    res.status(400)
    throw new Error('Pleace enter all values')
  }

  const agentExists = await Agent.findOne({ agent })

  if (agentExists && agentExists.company === req.body.company) {
    res.status(400)
    throw new Error('الاسم موجود مسبقاً')
  } else {
    const createdAgent = await Agent.create({ company, agent })
    res.status(200).json(createdAgent)
  }
})

export const deleteAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id)

  if (agent) {
    await Agent.deleteOne({ _id: agent._id })
    res.json('تم حذف العميل')
  } else {
    res.status(404)
    throw new Error('Agent not found')
  }
})

export const updateAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id)

  if (agent) {
    const allAgents = await Agent.find()
    const restOfAgents = allAgents.filter(
      (agent) => agent._id.toString() !== req.params.id
    )

    const doblicatedAgent = restOfAgents.find(
      (agent) =>
        agent.agent === req.body.agent && agent.company === req.body.company
    )

    if (doblicatedAgent) {
      res.status(400)
      throw new Error('الاسم موجود مسبقاً')
    } else {
      const updatedAgent = await Agent.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      res.json({
        _id: updatedAgent._id,
        company: updatedAgent.company,
        agent: updatedAgent.agent,
      })
    }
  } else {
    res.status(404)
    throw new Error('Agent not found')
  }
})

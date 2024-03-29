import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModal.js'

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(401)
    throw new Error('اسم المستخدم او كلمة السر غير صحيحة')
  }
})

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExsists = await User.findOne({ email })

  if (userExsists) {
    res.status(400)
    throw new Error('اسم المستخدم موجود مسبقاً')
  }

  const user = await User.create({ name, email, password })

  if (user) {
    // generateToken(res, user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})

  res.json(users)
})

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      // name: user.name,
      // email: user.email,
      // isAdmin: user.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('User notfound')
  }
})

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    // user.name = req.body.name || user.name
    // user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      // name: updatedUser.name,
      // email: updatedUser.email,
      // isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('User not found')
  }
})

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin)

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('User not found')
  }
})

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Can not remove admin user')
    }

    await User.deleteOne({ _id: user._id })

    res.json({ message: 'User removed' })
  } else {
    res.status(400)
    throw new Error('User not found')
  }
})

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({ message: 'logged out successfully' })
}

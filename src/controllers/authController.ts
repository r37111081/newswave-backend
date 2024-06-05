import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import Admin from '../models/Admin'
import validator from 'validator'
import { generateToken, clearToken } from '../utils/auth'
import { appError } from '../middleware/errorMiddleware'

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body
  if (email) {
    if (!validator.isEmail(email)) {
      return appError({ statusCode: 400, message: 'Email 格式不正確' }, next)
    }
  } else {
    return appError({ statusCode: 400, message: '請輸入Email' }, next)
  }

  if (password) {
    // 密碼8~16碼
    if (!validator.isLength(password, { min: 8, max: 16 })) {
      return next(appError({ statusCode: 400, message: '密碼長度需介於8~16碼' }, next))
    }
  } else {
    return appError({ statusCode: 400, message: '請輸入密碼' }, next)
  }

  if (!name) {
    return appError({ statusCode: 400, message: '請輸入暱稱' }, next)
  }
  const userExists = await User.findOne({ email })

  if (userExists) {
    return res.status(400).json({ status: false, message: '使用者已存在' })
  }

  const user = await User.create({ name, email, password })

  if (!user) {
    return res.status(400).json({ status: false, message: '建立使用者發生錯誤' })
  }
  const token = generateToken(res, user._id)

  res.status(201).json({
    status: true,
    message: '註冊成功',
    data: { id: user._id, name: user.name, email: user.email, token }
  })
}

const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ status: false, message: '找不到使用者 / 密碼錯誤' })
  }
  const token = generateToken(res, user._id)
  res.status(200).json({
    status: true,
    message: '登入成功',
    data: { id: user._id, name: user.name, email: user.email, token }
  })
}

const authenticateAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const admin = await Admin.findOne({ email })

  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(400).json({ status: false, message: '找不到使用者 / 密碼錯誤' })
  }
  const token = generateToken(res, admin._id)
  res.status(200).json({
    status: true,
    message: '登入成功',
    data: { id: admin._id, name: admin.name, email: admin.email, token }
  })
}

const logoutUser = (req: Request, res: Response) => {
  clearToken(res)
  res.status(200).json({ status: true, message: '登出成功' })
}

export { registerUser, authenticateUser, logoutUser, authenticateAdmin }

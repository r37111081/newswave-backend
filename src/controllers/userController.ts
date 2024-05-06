import { NextFunction, Request, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
// import { AuthenticationError } from '../middleware/errorMiddleware'

// 取得會員狀態資料
const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const user = await User.findById(userId, 'name email')

  if (!user) {
    return appError({ statusCode: 400, message: '登入發生錯誤，請稍候再嘗試' }, next)
  }

  appSuccess({
    res,
    message: '取得成功',
    data: user
  })
})

// 更新密碼 API
const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { password, confirmPassword } = req.body
  // 資料欄位正確
  if (!password || !confirmPassword) {
    return appError(apiState.DATA_MISSING, next)
  }
  // 密碼正確
  if (password !== confirmPassword) {
    return appError({ statusCode: 400, message: '密碼不一致' }, next)
  }
  // 加密密碼
  const newPassword = await bcrypt.hash(password, 8)

  await User.findByIdAndUpdate(req.user, {
    password: newPassword
  }).exec()

  appSuccess({
    res,
    message: '修改密碼成功',
    data: undefined
  })
})

// 取得會員基本資料
const getUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const user = await User.findById(userId, 'name email')

  if (!user) {
    return appError({ statusCode: 400, message: '登入發生錯誤，請稍候再嘗試' }, next)
  }

  appSuccess({
    res,
    message: '取得成功',
    data: user
  })
})
export { getUser, updatePassword, getUserInfo }

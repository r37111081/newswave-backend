import { NextFunction, Request, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import validator from 'validator'
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
    return appError({ statusCode: 401, message: '登入發生錯誤，請稍候再嘗試' }, next)
  }

  appSuccess({
    res,
    message: '取得成功',
    data: user
  })
})

// 更新密碼 API
const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { oldPassword, newPassword } = req.body
  const user = await User.findById(userId, 'password')
  const password = user?.password

  // 資料欄位正確
  if (!oldPassword || !newPassword) {
    return appError(apiState.DATA_MISSING, next)
  }

  // 密碼正確
  if (password) {
    // 密碼8~16碼
    if (!validator.isLength(newPassword, { min: 8, max: 16 })) {
      return next(appError({ statusCode: 400, message: '密碼長度需介於8~16碼' }, next))
    }
    bcrypt.compare(oldPassword, password).then((result) => {
      if (!result) {
        return appError({ statusCode: 400, message: '密碼不一致' }, next)
      }
    })
    if (oldPassword === newPassword) {
      return appError({ statusCode: 400, message: '新密碼不可與原密碼相同' }, next)
    }
  } else {
    return appError({ statusCode: 400, message: '密碼為undefined' }, next)
  }

  // 加密密碼
  const bcryptPassword = await bcrypt.hash(newPassword, 8)

  await User.findByIdAndUpdate(req.user, {
    password: bcryptPassword
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

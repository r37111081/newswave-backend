import { NextFunction, Request, Response } from 'express'
import User from '../models/User'
import Subscription from '../models/Subscription'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'

// 加入訂閱
const addSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const { plan, duration } = req.body

  // 計算訂閱到期日
  let expiryDate: Date
  if (duration === 'month') {
    expiryDate = new Date(new Date().setMonth(new Date().getMonth() + 1))
  } else if (duration === 'year') {
    expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  } else {
    return appError(apiState.ID_ERROR, next)
  }

  // 創建新的訂閱
  const subscription = new Subscription({
    plan,
    subscriptionDate: new Date(),
    expiryDate,
    duration
  })
  await subscription.save()

  // 查找用戶並添加訂閱
  const user = await User.findById(userId)
  if (!user) {
    return appError(apiState.DATA_NOT_FOUND, next)
  }

  user.subscriptions.push(subscription._id)
  await user.save()

  appSuccess({ res, message: '訂閱成功' })
})

const getSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  // const data = await User.findById(userId).populate('subscriptions')
  const data = await Subscription.findById(userId).select('-_id')
  if (!data) {
    return res.status(404).json({ message: 'User not found' })
  }

  appSuccess({ res, data, message: '查詢成功' })
})

export { addSubscription, getSubscription }

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

  user.subscriptions.unshift(subscription._id)
  await user.save()

  appSuccess({ res, message: '訂閱成功' })
})

const getSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const data = await User.findById(userId).populate('subscriptions')

  if (!data) {
    return appSuccess({ res, data, message: '查無使用者訂閱資訊' })
  }
  const subscriptions = data.subscriptions.map(subscription => ({
    _id: subscription._id,
    plan: subscription.plan,
    subscriptionDate: subscription.subscriptionDate,
    expiryDate: subscription.expiryDate,
    autoRenew: subscription.autoRenew
  }))

  appSuccess({ res, data: subscriptions, message: '查詢成功' })
})

const toggleRenewal = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { subscriptionId } = req.params
  const data = await Subscription.findById(subscriptionId)
  if (!data) {
    return appSuccess({ res, data: null, message: '沒有找到此筆訂閱紀錄' })
  }

  data.autoRenew = !data.autoRenew
  await data.save()

  appSuccess({ res, data: data.autoRenew, message: '狀態更新成功' })
})

export { addSubscription, getSubscription, toggleRenewal }

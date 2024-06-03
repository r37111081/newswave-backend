import { NextFunction, Request, Response } from 'express'
// import User from '../models/User'
import Order from '../models/Order'
import Subscription from '../models/Subscription'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'

const getSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { transactionId = '' } = req.query

  const filter = transactionId
    ? {
        userId: userId?.valueOf(),
        transactionId
      }
    : { userId: userId?.valueOf() }

  const data = await Order.find(
    filter,
    {
      _id: 0,
      userId: 0,
      updatedAt: 0
    }).sort({ createdAt: -1 })

  if (!data) {
    return appError(apiState.DATA_NOT_FOUND, next)
  }

  appSuccess({ res, data, message: '查詢成功' })
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

export { getSubscription, toggleRenewal }

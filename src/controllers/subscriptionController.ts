import { NextFunction, Request, Response } from 'express'
import Order from '../models/Order'
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

export { getSubscription }

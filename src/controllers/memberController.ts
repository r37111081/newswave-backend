import { NextFunction, Request, Response } from 'express'
import User from '../models/User'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'

const updateSubscriptionRenew = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { autoRenew } = req.body

  if (typeof autoRenew !== 'boolean') {
    return appError(apiState.DATA_MISSING, next)
  }

  await User.findByIdAndUpdate(userId, {
    autoRenew
  })

  return appSuccess({ res, data: { autoRenew }, message: '續訂狀態更新成功' })
})

export { updateSubscriptionRenew }

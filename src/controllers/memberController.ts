import { NextFunction, Request, Response } from 'express'
import News from '../models/News'
import User from '../models/User'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'

// 取得雜誌文章詳情
const getMagazineArticleDetail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { articleId } = req.params
  const pattern = /^M-\d+$/
  if (!pattern.test(articleId)) return appError(apiState.ID_ERROR, next)

  const data = await News.findOne({ articleId }).select('-_id')
  if (!data) return appError(apiState.DATA_NOT_FOUND, next)

  appSuccess({ res, data, message: '取得文章詳情成功' })
})

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

export { getMagazineArticleDetail, updateSubscriptionRenew }

import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
import { getSocektIo } from '../connections/socket'
import News from '../models/News'

// 新增文章
const createNewsArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, publishedAt, source, tags, articleId } = req.body
  if (!title || !content || !publishedAt || !source || !tags || !articleId) {
    return appError(apiState.DATA_MISSING, next)
  }
  const data = await News.create({
    title,
    content,
    publishedAt,
    source,
    tags,
    articleId
  })
  // getSocektIo().emit('new-news', {
  //   action: 'create',
  //   data
  // })
  appSuccess({ res, data, message: '新增文章成功' })
})

export { createNewsArticle }

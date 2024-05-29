import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
import { getSocektIo } from '../connections/socket'
import News from '../models/News'
import Notice from '../models/Notice'

// 新增文章
const createNewsArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { articleId, topic, editor, title, publishedAt, image, imageDescribe, content, source } = req.body
  const idPattern = /^N-\d+$/
  const datePattern = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/
  if (!topic || !editor || !title || !content ||
    !datePattern.test(publishedAt) || !idPattern.test(articleId)) {
    return appError(apiState.DATA_MISSING, next)
  }
  const data = await News.create({
    articleId,
    topic,
    editor,
    title,
    publishedAt,
    imageDescribe,
    image,
    content,
    source
  })
  createNotice(data)
  appSuccess({ res, message: '新增新聞文章成功' })
})

// 新增通知訊息
const createNotice = async (data: any) => {
  try {
    await Notice.create({
      articleId: data.articleId,
      title: data.title,
      topic: data.topic,
      image: data.image,
      publishedAt: data.publishedAt
    })
    getSocektIo().emit('notice', {
      action: 'create',
      receive: true
    })
  } catch (error) {
    throw new Error('新增通知訊息失敗')
  }
}

export { createNewsArticle }

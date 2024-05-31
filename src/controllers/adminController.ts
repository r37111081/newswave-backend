import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
import { postFollowNotice, postSystemNotice } from '../utils/notice'
import News from '../models/News'
import Notice from '../models/Notice'

// 新增新聞文章
const createNewsArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { articleId, topic, editor, title, publishedAt, image, imageDescribe, content, source } = req.body
  const idPattern = /^N-\d+$/
  const datePattern = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/
  if (!topic || !editor || !title || !content ||
    !datePattern.test(publishedAt) || !idPattern.test(articleId)) {
    return appError(apiState.DATA_MISSING, next)
  }
  const newsId = await News.findOne({ articleId })
  if (newsId) {
    return appError({ statusCode: 400, message: '文章編號已存在' }, next)
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
  postFollowNotice(data)
  appSuccess({ res, message: '新增新聞文章成功' })
})

// 取得所有通知訊息
const getNoticeList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { pageIndex, pageSize } = req.query

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const [totalElements, notices] = await Promise.all([
    Notice.countDocuments(),
    Notice.find()
      .sort({ publishedAt: -1 })
      .skip((pageIndexNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
      .lean()
      .then(notices =>
        notices.map(notice => ({
          ...notice,
          id: notice._id,
          _id: undefined
        }))
      )
  ])

  const firstPage = pageIndexNumber === 1
  const lastPage = totalElements <= pageIndexNumber * pageSizeNumber
  const empty = totalElements === 0
  const totalPages = Math.ceil(totalElements / pageSizeNumber)
  let data = {
    notices,
    firstPage,
    lastPage,
    empty,
    totalElements,
    totalPages,
    targetPage: pageIndexNumber
  }
  appSuccess({ res, data, message: '取得通知訊息列表成功' })
})

export { createNewsArticle, getNoticeList, postSystemNotice }

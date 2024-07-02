import mongoose from 'mongoose'
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
import { postFollowNotice, postSystemNotice } from '../utils/notice'
import { formatToDate } from '../utils/helper'
import News from '../models/News'
import Notice from '../models/Notice'
import Order from '../models/Order'

// 新增新聞文章
const createNewsArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { topic, editor, title, image, imageDescribe, content, source } = req.body
  let articleId
  if (!topic || !editor || !title || !image || !imageDescribe || !content || !source) {
    return appError(apiState.DATA_MISSING, next)
  }

  const latestNews = await News.findOne({ articleId: { $regex: /^N-/ } }).sort({ articleId: -1 })
  if (latestNews) {
    const nextIdNumber = parseInt(latestNews.articleId.split('-')[1]) + 1
    articleId = `N-${String(nextIdNumber).padStart(2, '0')}`
  } else {
    articleId = 'N-01'
  }

  const data = await News.create({
    articleId,
    topic,
    editor,
    title,
    publishedAt: formatToDate(),
    imageDescribe,
    image,
    content,
    source
  })
  postFollowNotice(data)
  appSuccess({ res, data, message: '新增新聞文章成功' })
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

// 取得用戶訂閱列表
const getAllUserOrderList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { pageIndex, pageSize, planType, orderId, userEmail } = req.query

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const planTypeState = planType !== undefined && planType !== ''
    ? { planType }
    : {}

  let orderIdState = {}
  if (orderId !== undefined && orderId !== '') {
    if (!mongoose.isValidObjectId(orderId)) {
      return appError({ statusCode: 400, message: '訂單編號格式有誤' }, next)
    } else {
      orderIdState = { _id: orderId }
    }
  }

  const queryState = { ...planTypeState, ...orderIdState }
  const [totalElements, orders] = await Promise.all([
    Order.countDocuments({ ...queryState }),
    Order.find({ ...queryState })
      .populate({
        path: 'userId',
        select: '_id name email'
      })
      .sort({ publishedAt: -1 })
      .skip((pageIndexNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
      .select('userId planType itemName')
  ])

  const ordersFilter = orders.filter((order: any) => {
    if (userEmail === undefined || userEmail === '') {
      return order
    } else {
      const { userId } = order
      if (!userId) return false
      return userId.email === userEmail
    }
  })

  const firstPage = pageIndexNumber === 1
  const lastPage = totalElements <= pageIndexNumber * pageSizeNumber
  const empty = totalElements === 0
  const totalPages = Math.ceil(totalElements / pageSizeNumber)
  let data = {
    orders: ordersFilter,
    firstPage,
    lastPage,
    empty,
    totalElements,
    totalPages,
    targetPage: pageIndexNumber
  }
  appSuccess({ res, data, message: '取得訂閱記錄列表成功' })
})

export { createNewsArticle, getNoticeList, postSystemNotice, getAllUserOrderList }

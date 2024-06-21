import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
import Magazine from '../models/Magazine'
import Comment from '../models/Comment'
import News, { INews } from '../models/News'

// 取得熱門新聞列表
const getHotNewsList = catchAsync(async (req: Request<INews>, res: Response, next: NextFunction) => {
  const limit = Number(req.query.limit)
  const type = req.query.type

  if (!limit || !type) {
    return appError(apiState.DATA_MISSING, next)
  }

  let query:any = { articleId: { $regex: /^N-/ } }

  let sort:any = {}
  if (type === 'hot') {
    query.tags = { $in: ['hot'] }
  } else if (type === 'news') {
    sort.publishedAt = -1
  }
  const data = await News.find(query)
    .sort(sort)
    .limit(limit)
    .select('-_id')
    .exec()

  if (!data) {
    return appError(apiState.DATA_NOT_FOUND, next)
  }

  if (data.length) {
    appSuccess({ res, data, message: '取得熱門新聞列表' })
  } else {
    appSuccess({ res, data, message: '尚無熱門新聞' })
  }
})

// 取得雜誌列表
const getAllMagazine = catchAsync(async (req: Request, res: Response) => {
  const data = await Magazine.find().select('-_id')
  appSuccess({ res, data, message: '取得雜誌列表成功' })
})

// 取得雜誌文章列表
const getMagazineList = catchAsync(async (req: Request, res: Response) => {
  const { pageIndex, pageSize, category } = req.query

  const categoryType = category !== undefined && category !== ''
    ? { 'source.name': category }
    : { articleId: /M-/ }

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const [totalElements, articles] = await Promise.all([
    News.countDocuments({ ...categoryType }),
    News.find({ ...categoryType })
      .select('-_id -content')
      .sort({ publishedAt: -1 })
      .skip((pageIndexNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
  ])

  const firstPage = pageIndexNumber === 1
  const lastPage = totalElements <= pageIndexNumber * pageSizeNumber
  const empty = totalElements === 0
  const totalPages = Math.ceil(totalElements / pageSizeNumber)
  let data = {
    articles,
    firstPage,
    lastPage,
    empty,
    totalElements,
    totalPages,
    targetPage: pageIndexNumber
  }
  appSuccess({ res, data, message: '取得文章列表成功' })
})

// 取得新聞首頁列表分頁
const getNewsPage = catchAsync(async (req: Request<INews>, res: Response, next: NextFunction) => {
  const { pageIndex, pageSize, topic } = req.query

  const topicType = topic !== undefined && topic !== ''
    ? {
        topic: { $in: [topic] },
        articleId: /^N-/
      }
    : { articleId: /^N-/ }

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const [totalElements, articles] = await Promise.all([
    News.countDocuments({ ...topicType }),
    News.find({ ...topicType })
      .select('-_id ')
      .sort({ publishedAt: -1 })
      .skip((pageIndexNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
  ])

  const firstPage = pageIndexNumber === 1
  const lastPage = totalElements <= pageIndexNumber * pageSizeNumber
  const empty = totalElements === 0
  const totalPages = Math.ceil(totalElements / pageSizeNumber)
  let data = {
    articles,
    firstPage,
    lastPage,
    empty,
    totalElements,
    totalPages,
    targetPage: pageIndexNumber
  }
  appSuccess({ res, data, message: '取得新聞列表' })
})

// 取得新聞、雜誌文章詳情
const getArticleDetail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { articleId } = req.params
  const pattern = /^N-\d+$|^M-\d+$/
  if (!pattern.test(articleId)) return appError(apiState.ID_ERROR, next)

  const data = await News.findOne({ articleId })
  if (!data) return appError(apiState.DATA_NOT_FOUND, next)

  if (articleId.startsWith('M-')) {
    data.content = data.content.length > 100
      ? data.content.substring(0, 100) + '...'
      : data.content
  }

  appSuccess({ res, data, message: '取得文章詳情成功' })
})

// 取得文章留言列表
const getArticleCommentList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { articleId } = req.params
  const { pageIndex, pageSize } = req.query

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const [totalElements, comments] = await Promise.all([
    Comment.countDocuments({ articleId }),
    Comment.find({ articleId })
      .populate([{
        path: 'user',
        select: '-_id name avatar'
      }, {
        path: 'userId',
        match: { _id: { $eq: userId } },
        select: '_id'
      }])
      .sort({ createdAt: -1 })
      .skip((pageIndexNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
      .select('-article -articleId -createdAt')
  ])

  const firstPage = pageIndexNumber === 1
  const lastPage = totalElements <= pageIndexNumber * pageSizeNumber
  const empty = totalElements === 0
  const totalPages = Math.ceil(totalElements / pageSizeNumber)
  const data = {
    comments,
    firstPage,
    lastPage,
    empty,
    totalElements,
    totalPages,
    targetPage: pageIndexNumber
  }
  appSuccess({ res, data, message: '取得留言列表成功' })
})

// 取得搜尋文章列表
const getSearchArticleList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { keyword, type, topic, pageIndex, pageSize } = req.query

  const keywordSort = keyword !== undefined && keyword !== ''
    ? { title: new RegExp(keyword as string, 'i') }
    : {}

  const typeStyle = {
    news: { articleId: { $regex: /^N-/ } },
    magazine: { articleId: { $regex: /^M-/ } }
  }

  const typeSort = type !== undefined && type !== '' && (type === 'news' || type === 'magazine')
    ? typeStyle[type]
    : {}

  const topicSort = topic !== undefined && topic !== ''
    ? { topic: { $in: [topic] } }
    : {}

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const content = { ...keywordSort, ...typeSort, ...topicSort }
  const [totalElements, articles] = await Promise.all([
    News.countDocuments(content),
    News.find(content)
      .sort({ publishedAt: -1 })
      .skip((pageIndexNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
  ])

  const firstPage = pageIndexNumber === 1
  const lastPage = totalElements <= pageIndexNumber * pageSizeNumber
  const empty = totalElements === 0
  const totalPages = Math.ceil(totalElements / pageSizeNumber)
  let data = {
    articles,
    firstPage,
    lastPage,
    empty,
    totalElements,
    totalPages,
    targetPage: pageIndexNumber
  }

  appSuccess({ res, data, message: '取得搜尋文章列表成功' })
})

export {
  getAllMagazine, getMagazineList,
  getArticleDetail, getHotNewsList,
  getArticleCommentList, getNewsPage,
  getSearchArticleList
}

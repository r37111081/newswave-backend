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
  const query = req.query
  const articlesPerPage = 6

  const category = query.category !== undefined && query.category !== ''
    ? { 'source.name': query.category }
    : { articleId: /M-/ }
  const pageIndex = query.pageIndex !== undefined && query.pageIndex !== ''
    ? parseInt(query.pageIndex as string)
    : 1

  const [totalElements, articles] = await Promise.all([
    News.countDocuments({ ...category }),
    News.find({ ...category })
      .select('-_id -content')
      .sort({ publishedAt: -1 })
      .skip((pageIndex - 1) * articlesPerPage)
      .limit(articlesPerPage)
  ])

  const firstPage = pageIndex === 1
  const lastPage = totalElements <= pageIndex * articlesPerPage
  const empty = totalElements === 0
  const totalPages = Math.ceil(totalElements / articlesPerPage)
  let data = {
    articles,
    firstPage,
    lastPage,
    empty,
    totalElements,
    totalPages,
    targetPage: pageIndex
  }
  appSuccess({ res, data, message: '取得文章列表成功' })
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
  const { id } = req.params
  const { pageIndex, pageSize } = req.query

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const [totalElements, comments] = await Promise.all([
    Comment.countDocuments({ article: id }),
    Comment.find({ article: id })
      .populate({
        path: 'user',
        select: '-_id name avatar'
      })
      .sort({ publishedAt: -1 })
      .skip((pageIndexNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
      .select('-article')
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

export { getAllMagazine, getMagazineList, getArticleDetail, getHotNewsList, getArticleCommentList }

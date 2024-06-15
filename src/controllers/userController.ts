import { NextFunction, Request, Response } from 'express'
import User from '../models/User'
import News from '../models/News'
import Comment from '../models/Comment'
import Notice from '../models/Notice'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
import { formatToDate } from '../utils/helper'

const topics = ['國際', '社會', '科技', '財經', '體育', '娛樂']

// 取得會員狀態資料
const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const user = await User.findById(userId, 'name avatar email subscribeExpiredAt collects follows planType autoRenew')

  if (!user) {
    return appError({ statusCode: 401, message: '登入發生錯誤，請稍候再嘗試' }, next)
  }

  appSuccess({
    res,
    message: '取得成功',
    data: user
  })
})

// 更新密碼 API
const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { oldPassword, newPassword } = req.body
  const user = await User.findById(userId, 'password')
  const password = user?.password

  // 資料欄位正確
  if (!oldPassword || !newPassword) {
    return appError(apiState.DATA_MISSING, next)
  }

  // 密碼正確
  if (password) {
    bcrypt.compare(oldPassword, password).then(async (result) => {
      if (!result) {
        return appError({ statusCode: 400, message: '舊密碼輸入錯誤' }, next)
      } else {
        // 密碼8~16碼
        if (!validator.isLength(newPassword, { min: 8, max: 16 })) {
          return next(appError({ statusCode: 400, message: '密碼長度需介於8~16碼' }, next))
        }
        if (oldPassword === newPassword) {
          return appError({ statusCode: 400, message: '新密碼不可與原密碼相同' }, next)
        }
        // 加密密碼
        const bcryptPassword = await bcrypt.hash(newPassword, 8)

        await User.findByIdAndUpdate(req.user, {
          password: bcryptPassword
        }).exec()

        appSuccess({
          res,
          message: '修改密碼成功',
          data: undefined
        })
      }
    })
  } else {
    return appError({ statusCode: 400, message: '請輸入密碼' }, next)
  }
})

// 取得會員基本資料
const getUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const user = await User.findById(userId, 'name email birthday gender zipcode detail country city')

  if (!user) {
    return appError({ statusCode: 400, message: '登入發生錯誤，請稍候再嘗試' }, next)
  }

  appSuccess({
    res,
    message: '取得成功',
    data: user
  })
})

// 更新會員基本資料
const updateUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { name, birthday, gender, avatar } = req.body
  const verifyBirthday = (val:string) => /^(\d{4})-(\d{2})-(\d{2})$/.test(val)
  const verifyGender = (val:string) => /^[01]$/.test(val)
  let updateData = {}

  if (name && birthday && gender) {
    if (!verifyBirthday(birthday)) {
      return appError({ statusCode: 400, message: '生日格式錯誤' }, next)
    }
    if (!verifyGender(gender)) {
      return appError({ statusCode: 400, message: '性別格式錯誤' }, next)
    }
    updateData = { name, birthday, gender }
  }

  if (avatar) {
    updateData = { ...updateData, avatar }
  }

  const data = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
    .select('-_id name email birthday gender avatar')

  appSuccess({ res, data, message: '更新會員基本資料成功' })
})

// 取得會員文章收藏列表
const getUserCollectList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { pageIndex, pageSize } = req.query

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const user = await User.findById(userId)
  if (!user) return appError(apiState.DATA_NOT_FOUND, next)

  const articles = await News.find({ articleId: { $in: user.collects } })
    .select('-_id -content -collects')
    .sort({ publishedAt: -1 })
    .skip((pageIndexNumber - 1) * pageSizeNumber)
    .limit(pageSizeNumber)

  const totalElements = user.collects.length
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

// 新增會員收藏文章
const addArticleCollect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { articleId } = req.params

  const article = await News.findOne({ articleId })
  if (!article) return appError(apiState.DATA_NOT_FOUND, next)

  await User.findByIdAndUpdate(userId, {
    $addToSet: { collects: articleId }
  }, { runValidators: true })

  appSuccess({ res, message: '收藏文章成功' })
})

// 取消會員收藏文章
const deleteArticleCollect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { articleId } = req.params

  const article = await News.findOne({ articleId })
  if (!article) return appError(apiState.DATA_NOT_FOUND, next)

  await User.findByIdAndUpdate(userId, {
    $pull: { collects: articleId }
  }, { runValidators: true })

  appSuccess({ res, message: '取消收藏文章成功' })
})

// 取得會員主題追蹤列表
const getUserFollowList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id

  const user = await User.findById(userId)
  if (!user) return appError(apiState.DATA_NOT_FOUND, next)

  let data = user.follows
  appSuccess({ res, data, message: '取得追蹤主題列表成功' })
})

// 新增會員追蹤主題
const addArticleFollow = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { topic } = req.query

  if (!topics.includes(topic as string)) {
    return appError({ statusCode: 400, message: '主題不存在' }, next)
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: { follows: topic }
  }, { runValidators: true })

  appSuccess({ res, message: '追蹤主題成功' })
})

// 取消會員追蹤主題
const deleteArticleFollow = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { topic } = req.query

  if (!topics.includes(topic as string)) {
    return appError({ statusCode: 400, message: '主題不存在' }, next)
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { follows: topic }
  }, { runValidators: true })

  appSuccess({ res, message: '取消追蹤主題成功' })
})

// 取得會員留言列表
const getUserCommentList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { pageIndex, pageSize } = req.query

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const [totalElements, comments] = await Promise.all([
    Comment.countDocuments({ user: userId }),
    Comment.find({ user: userId })
      .populate({
        path: 'article',
        select: '-content'
      })
      .sort({ createdAt: -1 })
      .skip((pageIndexNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
      .select('-user -articleId -createdAt -userId')
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

// 新增會員留言
const createUserComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { articleId } = req.params
  const { content } = req.body

  if (!content) return appError(apiState.DATA_MISSING, next)

  const article = await News.findOne({ articleId })
  if (!article) return appError(apiState.DATA_NOT_FOUND, next)

  await Comment.create({
    user: userId,
    userId,
    articleId,
    article: article?._id,
    content,
    publishedAt: formatToDate()
  })

  appSuccess({ res, message: '新增留言成功' })
})

// 刪除會員留言
const deleteUserComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { commentId } = req.params

  const comment = await Comment.findOneAndDelete({ _id: commentId, user: userId })
  if (!comment) {
    return appError(apiState.FAIL, next)
  }

  appSuccess({ res, message: '刪除留言成功' })
})

// 取得雜誌文章詳情
const getMagazineArticleDetail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { articleId } = req.params
  const pattern = /^M-\d+$/
  if (!pattern.test(articleId)) return appError(apiState.ID_ERROR, next)

  const article = await News.findOne({ articleId }).select('-_id')
  if (!article) return appError(apiState.DATA_NOT_FOUND, next)

  const user = await User.findById(userId)
  if (!user) return appError(apiState.DATA_NOT_FOUND, next)

  if (user.planType === '') {
    article.content = article.content.substring(0, 100) + '...'
  }

  const data = {
    article,
    quota: user.numberOfReads,
    planType: user.planType
  }

  appSuccess({ res, data, message: '取得文章詳情成功' })
})

// 免費閱讀雜誌文章詳情
const getMagazineArticleQuota = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { articleId } = req.params
  const pattern = /^M-\d+$/
  if (!pattern.test(articleId)) return appError(apiState.ID_ERROR, next)

  const article = await News.findOne({ articleId }).select('-_id')
  if (!article) return appError(apiState.DATA_NOT_FOUND, next)

  const user = await User.findById(userId)
  if (!user) return appError(apiState.DATA_NOT_FOUND, next)

  if (user.numberOfReads === 0) {
    return appError({ statusCode: 400, message: '免費閱讀次數已用完' }, next)
  }

  user.numberOfReads -= 1
  await user.save()

  const data = {
    article,
    quota: user.numberOfReads,
    planType: user.planType
  }

  appSuccess({ res, data, message: '取得免費閱讀文章詳情成功' })
})

// 取得會員通知訊息列表
const getUserNoticeList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { pageIndex, pageSize, readState } = req.query

  const pageIndexNumber = pageIndex !== undefined && pageIndex !== ''
    ? parseInt(pageIndex as string)
    : 1

  const pageSizeNumber = pageSize !== undefined && pageSize !== ''
    ? parseInt(pageSize as string)
    : 10

  const readStateType = readState !== undefined && readState !== ''
    ? readState as string
    : ''

  const user = await User.findById(userId)
  if (!user) return appError(apiState.DATA_NOT_FOUND, next)

  let userNotices = user.notices
  if (readStateType === 'unread') {
    userNotices = userNotices.filter(n => !n.read)
  } else if (readStateType === 'read') {
    userNotices = userNotices.filter(n => n.read)
  }

  const noticeIds = userNotices.map(n => n.noticeId)
  const notices = await Notice.find({ _id: { $in: noticeIds } })
    .sort({ publishedAt: -1 })
    .skip((pageIndexNumber - 1) * pageSizeNumber)
    .limit(pageSizeNumber)

  const totalElements = noticeIds.length
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

// 會員已閱讀此通知訊息
const updateUserNoticeRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { noticeId } = req.params

  await User.updateOne(
    { _id: userId, 'notices.noticeId': noticeId },
    { $set: { 'notices.$.read': true } }
  )

  appSuccess({ res, message: '已閱讀通知訊息成功' })
})

// 會員刪除所有通知訊息
const deleteUserAllNotice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id

  const data = await User.findByIdAndUpdate(userId, {
    notices: []
  }, { new: true, runValidators: true }).select('-_id notices')

  appSuccess({ res, data, message: '刪除所有通知訊息成功' })
})

export {
  getUser, updatePassword, getUserInfo,
  updateUserInfo, getUserCollectList,
  addArticleCollect, deleteArticleCollect,
  getUserFollowList, addArticleFollow,
  deleteArticleFollow, getUserCommentList,
  createUserComment, deleteUserComment,
  getMagazineArticleDetail, getUserNoticeList,
  deleteUserAllNotice, updateUserNoticeRead,
  getMagazineArticleQuota
}

import { NextFunction, Request, Response } from 'express'
import User from '../models/User'
import News from '../models/News'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'

// 取得會員狀態資料
const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const user = await User.findById(userId, 'name avatar email isVip subscribeExpiredAt collectElements followElements')

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
  const user = await User.findById(userId, 'name email birthday address zipcode detail country city')

  if (!user) {
    return appError({ statusCode: 400, message: '登入發生錯誤，請稍候再嘗試' }, next)
  }

  appSuccess({
    res,
    message: '取得成功',
    data: user
  })
})

// 取得會員文章收藏列表
const getUserCollectList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const query = req.query
  const articlesPerPage = 6

  const pageIndex = query.pageIndex !== undefined && query.pageIndex !== ''
    ? parseInt(query.pageIndex as string)
    : 1

  const [totalElements, articles] = await Promise.all([
    News.countDocuments({
      collects: { $in: [userId] }
    }),
    News.find({
      collects: { $in: [userId] }
    })
      .select('-_id -content -collects')
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

// 新增會員收藏文章
const addArticleCollect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { articleId } = req.params

  await News.findOneAndUpdate({ articleId }, {
    $addToSet: { collects: userId }
  }, { runValidators: true })

  appSuccess({ res, message: '收藏文章成功' })
})

// 取消會員收藏文章
const deleteArticleCollect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id
  const { articleId } = req.params

  await News.findOneAndUpdate({ articleId }, {
    $pull: { collects: userId }
  }, { runValidators: true }).exec()

  appSuccess({ res, message: '取消收藏文章成功' })
})

export { getUser, updatePassword, getUserInfo, getUserCollectList, addArticleCollect, deleteArticleCollect }

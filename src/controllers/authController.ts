import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import validator from 'validator'
import Magazine from '../models/Magazine'
import News from '../models/News'
import { generateToken, clearToken } from '../utils/auth'
import { appError } from '../middleware/errorMiddleware'

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })

  if (email) {
    if (!validator.isEmail(email)) {
      return appError({ statusCode: 400, message: 'Email 格式不正確' }, next)
    }
  } else {
    return appError({ statusCode: 400, message: '請輸入Email' }, next)
  }

  if (password) {
    // 密碼8~16碼
    if (!validator.isLength(password, { min: 8, max: 16 })) {
      return next(appError({ statusCode: 400, message: '密碼長度需介於8~16碼' }, next))
    }
  } else {
    return appError({ statusCode: 400, message: '請輸入密碼' }, next)
  }

  if (!name) {
    return appError({ statusCode: 400, message: '請輸入暱稱' }, next)
  }

  if (userExists) {
    res.status(400).json({
      status: false,
      message: '使用者已存在'
    })
    return
  }

  const user = await User.create({
    name, email, password
  })
  if (user) {
    const token = generateToken(res, user._id)
    res.status(201).json({
      status: true,
      message: '註冊成功',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    })
  } else {
    res.status(400).json({ status: false, message: '建立使用者發生錯誤' })
  }
}

const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.comparePassword(password))) {
    const token = generateToken(res, user._id)
    res.status(200).json({
      status: true,
      message: '登入成功',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    })
  } else {
    res.status(401).json({ status: false, message: '找不到使用者 / 密碼錯誤' })
  }
}

const logoutUser = (req: Request, res: Response) => {
  clearToken(res)
  res.status(200).json({ status: true, message: '登出成功' })
}

const getAllMagazine = async (req: Request, res: Response) => {
  try {
    const data = await Magazine.find()

    res.status(200).json({
      status: true,
      message: '取得雜誌列表成功',
      data
    })
  } catch (error) {
    console.error(error)
  }
}

const getMagazineList = async (req: Request, res: Response) => {
  try {
    const query = req.query
    const articlesPerPage = 6

    const category = query.category !== undefined ? { 'source.name': query.category } : {}
    const pageIndex = query.pageIndex !== undefined && query.pageIndex !== ''
      ? parseInt(query.pageIndex as string)
      : 1

    const [totalElements, articles] = await Promise.all([
      News.countDocuments({ ...category }),
      News.find({ ...category })
        .skip((pageIndex - 1) * articlesPerPage)
        .limit(articlesPerPage)
    ])

    const firstPage = pageIndex === 1
    const lastPage = totalElements <= pageIndex * articlesPerPage
    const empty = totalElements === 0
    const totalPages = Math.ceil(totalElements / articlesPerPage)
    res.status(200).json({
      status: true,
      message: '取得雜誌文章列表成功',
      data: {
        articles,
        firstPage,
        lastPage,
        empty,
        totalElements,
        totalPages,
        targetPage: pageIndex
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export { registerUser, authenticateUser, logoutUser, getAllMagazine, getMagazineList }

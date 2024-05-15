import { Request, Response } from 'express'
import { appSuccess } from '../utils/appSuccess'
import Magazine from '../models/Magazine'
import News from '../models/News'

// 取得雜誌列表
const getAllMagazine = async (req: Request, res: Response) => {
  try {
    const data = await Magazine.find().select('-_id')
    appSuccess({ res, data, message: '取得雜誌列表成功' })
  } catch (error) {
    res.status(500).json({ status: false, message: '伺服器錯誤' })
  }
}

// 取得雜誌文章列表
const getMagazineList = async (req: Request, res: Response) => {
  try {
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
    appSuccess({ res, data, message: '取得雜誌文章列表成功' })
  } catch (error) {
    res.status(500).json({ status: false, message: '伺服器錯誤' })
  }
}

// 取得新聞文章詳情
const getNewsArticleDetail = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params
    if (!articleId.includes('N-')) return res.status(400).json({ status: false, message: '新聞ID格式錯誤' })

    const data = await News.findOne({ articleId }).select('-_id')
    if (!data) return res.status(400).json({ status: false, message: '找不到新聞文章' })

    appSuccess({ res, data, message: '取得文章詳情成功' })
  } catch (error) {
    res.status(500).json({ status: false, message: '伺服器錯誤' })
  }
}

export { getAllMagazine, getMagazineList, getNewsArticleDetail }

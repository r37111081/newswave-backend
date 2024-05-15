import { Request, Response } from 'express'
import { appSuccess } from '../utils/appSuccess'
import News from '../models/News'

// 取得雜誌文章詳情
const getMagazineArticleDetail = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params
    if (!articleId.includes('M-')) return res.status(400).json({ status: false, message: '雜誌ID格式錯誤' })

    const data = await News.findOne({ articleId }).select('-_id')
    if (!data) return res.status(400).json({ status: false, message: '找不到雜誌文章' })

    appSuccess({ res, data, message: '取得文章詳情成功' })
  } catch (error) {
    res.status(500).json({ status: false, message: '伺服器錯誤' })
  }
}

export { getMagazineArticleDetail }

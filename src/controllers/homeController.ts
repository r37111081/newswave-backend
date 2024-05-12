import { Request, Response } from 'express'
import News from '../models/News'
const getHotNewsList = async (req: Request, res: Response) => {
  try {
    const data = await News.find()

    if (data) {
      res.status(200).json({
        status: true,
        message: '取得成功',
        data
      })
    } else {
      res.status(200).json({
        status: true,
        message: '尚無熱門新聞',
        data
      })
    }
  } catch (error) {
    console.error(error)

    res.status(404).json({
      message: '發生錯誤',
      status: false
    })
  }
}

export { getHotNewsList }

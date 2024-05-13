import { Request, Response } from 'express'
import News, { INews } from '../models/News'
const getHotNewsList = async (req: Request, res: Response) => {
  try {
    const data = await News.find()
    const newsDataListSortByPublishedAt = data.sort((a:INews, b:INews) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)))
    const dataResult = newsDataListSortByPublishedAt.filter((item, index) => index < 6)

    if (dataResult.length) {
      res.status(200).json({
        status: true,
        message: '取得成功',
        dataResult
      })
    } else {
      res.status(200).json({
        status: true,
        message: '尚無熱門新聞',
        dataResult
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

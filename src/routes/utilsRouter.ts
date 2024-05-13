import express from 'express'
import {
  getHotNewsList
} from '../controllers/homeController'

const router = express.Router()

router.get('/hot-news-list'
/**
   * #swagger.tags = ['HotNewsList']
   * #swagger.description  = "取得熱門新聞列表"
   * #swagger.responses[200] = {
      schema: {
        "status": true,
        "message": "取得成功",
        "data": [
          {
            "articleId": "N-1011",
            "title":"MLB》大谷翔平太傻才被騙? 紐媒酸:他是棒球天才、理財傻瓜",
            "topic":["體育"],
            "publishedAt":1234567890123,
            "image": "https://pgw.udn.com.tw/gw/photo.png",
            "source": {
              "name": "聯合新聞網",
              "url": "https://udn.com"
            }
          }
        ]
      },
    * #swagger.responses[404] = {
        schema: {
          "message" : "發生錯誤",
          "status": false
        }
    }
*/
  , getHotNewsList)

export default router

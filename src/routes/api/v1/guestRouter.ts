import express from 'express'
import {
  getAllMagazine,
  getMagazineList,
  getArticleDetail,
  getHotNewsList,
  getArticleCommentList
} from '../../../controllers/guestController'
import { getUserId } from '../../../middleware/authMiddleware'

const router = express.Router()

router.get(
  '/magazine-category-list',
  /**
    #swagger.tags = ['Guests']
    #swagger.description  = "取得雜誌種類列表"
    #swagger.responses[200] = {
      description: '雜誌種類列表資訊',
      schema: { $ref: '#/definitions/magazineList' }
    }
  */
  getAllMagazine
)
router.get(
  '/magazine-article-page',
  /**
    #swagger.tags = ['Guests']
    #swagger.description  = "取得雜誌文章列表分頁"
    #swagger.parameters['pageSize'] = {
      in: 'query',
      type: 'String',
      description: '每頁數量',
    },
    #swagger.parameters['pageIndex'] = {
      in: 'query',
      type: 'String',
      description: '當前頁數',
    },
    #swagger.parameters['category'] = {
      in: 'query',
      type: 'String',
      description: '雜誌種類',
    },
    #swagger.responses[200] = {
      description: '雜誌文章列表資訊',
      schema: { $ref: '#/definitions/articleList' }
    }
  */
  getMagazineList
)
router.get('/article-detail/:articleId',
/*
  #swagger.tags= ['Guests']
  #swagger.description = '取得新聞、雜誌文章詳情'
  #swagger.parameters['articleId'] = {
    in: 'path',
    description: '文章ID',
    required: true,
    type: 'string'
  }
  #swagger.responses[200] = {
    description: '新聞、雜誌文章詳情資訊',
    schema: { $ref: '#/definitions/articleDetailInfo' }
  }
*/
  getArticleDetail)
router.get('/hot-news-list'
  /**
     * #swagger.tags = ['Guests']
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
              "publishedAt":2024-01-09 15:39,
              "image": "https://pgw.udn.com.tw/gw/photo.png",
              "source": {
                "name": "聯合新聞網",
                "url": "https://udn.com"
              }
            }
          ]
        }
      }
  */
  , getHotNewsList)
router.get('/article-comment-page/:articleId', getUserId
  /*
    #swagger.tags= ['Guests']
    #swagger.description = '取得文章留言列表'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['articleId'] = {
      in: 'path',
      description: '文章ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['pageSize'] = {
      in: 'query',
      type: 'String',
      description: '每頁數量',
    },
    #swagger.parameters['pageIndex'] = {
      in: 'query',
      type: 'String',
      description: '當前頁數',
    },
    #swagger.responses[200] = {
      description: '留言列表資訊',
      schema: { $ref: '#/definitions/guestCommentList' }
    }
  */
  , getArticleCommentList)
export default router

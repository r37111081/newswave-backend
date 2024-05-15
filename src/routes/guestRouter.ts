import express from 'express'
import {
  getAllMagazine,
  getMagazineList,
  getNewsArticleDetail
} from '../controllers/guestController'

const router = express.Router()

router.get(
  '/magazine-category-list',
  /**
    #swagger.tags = ['Guset - 未登入使用者']
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
    #swagger.tags = ['Guset - 未登入使用者']
    #swagger.description  = "取得雜誌文章列表分頁"
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['category'] = {
      in: 'query',
      type: 'String',
      description: '雜誌種類',
    },
    #swagger.parameters['pageIndex'] = {
      in: 'query',
      type: 'String',
      description: '當前頁數',
    },
    #swagger.responses[200] = {
      description: '雜誌文章列表資訊',
      schema: { $ref: '#/definitions/magazineInfo' }
    }
  */
  getMagazineList
)
router.get('/news-article-detail/:articleId',
/*
  #swagger.tags= ['Guset - 未登入使用者']
  #swagger.description = '取得新聞文章詳情'
  #swagger.responses[200] = {
    description: '新聞文章詳情資訊',
    schema: { $ref: '#/definitions/articleDetailInfo' }
  }
*/
  getNewsArticleDetail)

export default router

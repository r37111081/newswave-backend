import express from 'express'
import {
  getAllMagazine,
  getMagazineList,
  getArticleDetail
} from '../../../controllers/guestController'

const router = express.Router()

router.get(
  '/magazine-category-list',
  /**
    #swagger.tags = ['Gusets']
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
    #swagger.tags = ['Gusets']
    #swagger.description  = "取得雜誌文章列表分頁"
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
      schema: { $ref: '#/definitions/articleList' }
    }
  */
  getMagazineList
)
router.get('/article-detail/:articleId',
/*
  #swagger.tags= ['Gusets']
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

export default router

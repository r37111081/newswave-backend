import express from 'express'
import {
  getMagazineArticleDetail
} from '../../../controllers/memberController'

const router = express.Router()

router.get('/magazine-article-detail/:articleId',
/*
  #swagger.tags= ['Members']
  #swagger.description = '取得雜誌文章詳情'
  #swagger.security = [{'api_key': ['apiKeyAuth']}]
  #swagger.parameters['articleId'] = {
    in: 'path',
    description: '文章ID',
    required: true,
    type: 'string'
  }
  #swagger.responses[200] = {
    description: '雜誌文章詳情資訊',
    schema: { $ref: '#/definitions/articleDetailInfo' }
  }
*/
  getMagazineArticleDetail)

export default router

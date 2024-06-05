import express from 'express'
import { getMagazineArticleDetail, updateSubscriptionRenew } from '../../../controllers/memberController'

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

router.patch('/auto-renew',
  /*
    * #swagger.tags= ['Members']
      #swagger.description = '更新訂閱續訂狀態'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['autoRenew'] = {
        in: 'path',
        description: 'autoRenew',
        required: true,
        type: 'boolean'
      }
      #swagger.responses[200] = {
        description: '狀態更新成功',
        schema: {
          status: true,
          message: '狀態更新成功'
        }
      }
    */
  updateSubscriptionRenew)

export default router

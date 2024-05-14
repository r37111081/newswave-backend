import express from 'express'
import { getUser, getUserInfo, getMagazineList } from '../controllers/userController'

export const router = express.Router()

router.get('/data/:id'
  /**
     * #swagger.tags = ['Users']
     * #swagger.description  = "取得會員狀態資料"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": {},
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此最新消息不存在",
            }
        }
     */
  , getUser)

router.get('/info/:id'
  /**
     * #swagger.tags = ['User - 會員']
     * #swagger.description  = "取得會員基本資料"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "result": {},
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此最新消息不存在",
            }
        }
     */
  , getUserInfo)

router.get('/magazine-article-page',
/**
  #swagger.tags = ['Magazine']
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
  getMagazineList)
export default router

import express from 'express'
import {
  getUser,
  getUserInfo,
  updatePassword,
  getUserCollectList,
  addArticleCollect,
  deleteArticleCollect
} from '../controllers/userController'
import { authenticate } from '../middleware/authMiddleware'

export const router = express.Router()

router.patch(
  '/password',
  authenticate,
  /*
    #swagger.tags = ['User - 會員']
    #swagger.description = '更新密碼 API'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: '資料格式',
      schema: {
        $oldPassword: '',
        $newPassword: '',
      }
    }
    #swagger.responses[200] = {
      description: '更新密碼資訊',
      schema: {
        status: true,
        message: '更新密碼成功'
      }
    }
  */
  updatePassword
)

router.get(
  '/data/:id',
  /**
     * #swagger.tags = ['Users']
     * #swagger.description  = "取得會員狀態資料"
     * #swagger.security = [{'api_key': ['apiKeyAuth']}]
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
  getUser
)

router.get(
  '/info/:id',
  /**
     * #swagger.tags = ['User - 會員']
     * #swagger.description  = "取得會員基本資料"
     * #swagger.security = [{'api_key': ['apiKeyAuth']}]
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
  getUserInfo
)

router.get('/collect-page',
/*
  #swagger.tags = ['User - 登入使用者']
  #swagger.description = '取得收藏列表'
  #swagger.security = [{'api_key': ['apiKeyAuth']}]
  #swagger.parameters['pageIndex'] = {
    in: 'query',
    type: 'String',
    description: '當前頁數',
  },
  #swagger.responses[200] = {
    description: '收藏列表資訊',
    schema: { $ref: '#/definitions/articleList' }
  }
  */
  getUserCollectList)
router.post('/collect-article/:articleId',
  /*
    #swagger.tags = ['User - 登入使用者']
    #swagger.description = '新增收藏文章'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['articleId'] = {
      in: 'path',
      description: '文章ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: '收藏文章資訊',
      schema: {
        status: true,
        message: '收藏文章成功'
      }
    }
  */
  addArticleCollect)
router.delete('/collect-article/:articleId',
  /*
    #swagger.tags = ['User - 登入使用者']
    #swagger.description = '取消收藏文章'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['articleId'] = {
      in: 'path',
      description: '文章ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: '收藏文章資訊',
      schema: {
        status: true,
        message: '取消收藏文章成功'
      }
    }
  */
  deleteArticleCollect)

export default router

import express from 'express'
import {
  getUser,
  getUserInfo,
  updatePassword
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

export default router

import express from 'express'
import { getUser, updatePassword, getUserInfo, getMagazineList } from '../controllers/userController'
import { authenticate } from '../middleware/authMiddleware'

const router = express.Router()

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
router.patch('/password', authenticate,
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

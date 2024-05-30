import express from 'express'
import {
  getUser,
  getUserInfo,
  updatePassword,
  updateUserInfo,
  getUserCollectList,
  addArticleCollect,
  deleteArticleCollect,
  getUserFollowList,
  addArticleFollow,
  deleteArticleFollow,
  getUserNoticeList,
  updateUserNoticeRead,
  deleteUserAllNotice
} from '../../../controllers/userController'
import {
  registerUser,
  authenticateUser,
  logoutUser
} from '../../../controllers/authController'
import { addSubscription, getSubscription, toggleRenewal } from '../../../controllers/subscriptionController'
import { authenticate } from '../../../middleware/authMiddleware'

export const router = express.Router()

router.post('/register',
  /**
   * #swagger.tags= ['Users']
   * #swagger.parameters['obj'] = {
          in: 'body',
          required: true,
          description: "使用者註冊",
          schema: {
              "name":"user",
              "email":"user@gmail.com",
              "password":"user1234"
          },
      }
    * #swagger.responses[201] = {
          description: '註冊成功',
          schema: {
              "status": true,
              "message": "註冊成功",
              "uid": "QZDQO0zh...."
          }
      }
    * #swagger.responses[400] = {
          description: '使用者已存在',
          schema: {
              "status": false,
              "message": "使用者已存在",
          }
      }
    */
  registerUser)
router.post('/login',
  /**
         * #swagger.tags= ['Users']
         * #swagger.description  = "使用者登入"
         * #swagger.parameters['body'] = {
                in: 'body',
                schema: {
                    "email":"user@gmail.com",
                    "password":"user1234"
                },
            }
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
  authenticateUser)
router.post('/logout',
  /**
         * #swagger.tags= ['Users']
         * #swagger.ignore = true
         * #swagger.description  = "使用者登出"
         * #swagger.parameters['body'] = {
                in: 'body',
                schema: {},
            }
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
  logoutUser)

// 以下放需要被驗證的路由
router.use(authenticate)
router.patch('/password',
  /*
    * #swagger.tags= ['Users']
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
  updatePassword)
router.get('/data/:id',
  /**
     * #swagger.tags= ['Users']
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
  getUser)
router.get('/info/:id',
  /**
     * #swagger.tags= ['Users']
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
  getUserInfo)
router.patch('/info',
  /*
    * #swagger.tags= ['Users']
    #swagger.description = '更新會員基本資料'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: '資料格式',
      schema: {
        name: '姓名',
        birthday: '生日，格式為 YYYY-MM-DD',
        gender: '性別，0 表示男性，1 表示女性',
        avatar: '頭像網址'
      }
    }
    #swagger.responses[200] = {
      description: '主題追蹤資訊',
      schema: {
        status: true,
        message: '主題追蹤成功'
      }
    }
  */
  updateUserInfo)
router.get('/collect-page',
  /*
    * #swagger.tags= ['Users']
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
    * #swagger.tags= ['Users']
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
    * #swagger.tags= ['Users']
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
router.get('/notice-list', getUserNoticeList)
router.patch('/notice/:noticeId', updateUserNoticeRead)
router.delete('/notice', deleteUserAllNotice)
// 訂閱服務
router.get('/:userId/subscription',
  /*
    * #swagger.tags= ['Users']
      #swagger.description = '查詢用戶訂閱狀態'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['userId'] = {
        in: 'path',
        description: 'userId',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: '成功返回用戶的訂閱狀態',
        schema: {$ref: '#/definitions/subscriptionInfo'}
      }
    */
  getSubscription)
router.post('/:userId/subscription',
  /*
      * #swagger.tags= ['Users']
      #swagger.description = '訂閱服務'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['userId'] = {
        in: 'path',
        description: 'userId',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: '訂閱成功',
        schema: {
          status: true,
          message: '訂閱成功'
        }
      }
    */
  addSubscription)
router.patch('/:subscriptionId/subscription/renew',
  /*
    * #swagger.tags= ['Users']
      #swagger.description = '更新訂閱的續訂狀態'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['subscriptionId'] = {
        in: 'path',
        description: 'subscriptionId',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: '狀態更新成功',
        schema: {
          status: true,
          message: '狀態更新成功'
        }
      }
    */
  toggleRenewal)
router.get('/follow-topic',
  /*
    * #swagger.tags= ['Users']
    #swagger.description = '取得主題追蹤列表'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.responses[200] = {
      description: '主題列表資訊',
      schema: {
        status: true,
        data: [],
        message: '取得主題列表成功'
      }
    }
  */
  getUserFollowList)
router.post('/follow-topic',
  /*
    * #swagger.tags= ['Users']
    #swagger.description = '新增主題追蹤'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['topic'] = {
      in: 'query',
      description: '主題',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: '主題追蹤資訊',
      schema: {
        status: true,
        message: '主題追蹤成功'
      }
    }
  */
  addArticleFollow)
router.delete('/follow-topic',
  /*
    * #swagger.tags= ['Users']
    #swagger.description = '取消主題追蹤'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['topic'] = {
      in: 'query',
      description: '主題',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: '主題追蹤資訊',
      schema: {
        status: true,
        message: '取消主題追蹤成功'
      }
    }
  */
  deleteArticleFollow)

export default router

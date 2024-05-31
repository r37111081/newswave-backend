import express from 'express'
import { authenticateAdmin } from '../../../controllers/authController'
import { getNoticeList, createNewsArticle } from '../../../controllers/adminController'

const router = express.Router()

router.post('/login',
/**
     * #swagger.tags= ['Admins']
     * #swagger.description  = "後台管理者登入"
     * #swagger.parameters['body'] = {
             in: 'body',
            schema: {
                "email":"admin@gmail.com",
                "password":"admin1234"
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
  authenticateAdmin)

router.get('/notice-list',
  /*
    * #swagger.tags= ['Admins']
    #swagger.description = '取得所有通知訊息列表'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
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
      description: '通知訊息列表資訊',
      schema: { $ref: '#/definitions/noticeList' }
    }
  */
  getNoticeList)
router.post('/create-news-article',
  /*
    * #swagger.tags= ['Admins']
    #swagger.description = '新增新聞文章'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: '資料格式',
      schema: {
        articleId: '文章ID',
        title: '文章標題',
        editor: '文章編輯',
        topics: ['文章標籤'],
        publishedAt: '文章發布時間',
        image: '文章圖片',
        imageDescription: '文章圖片描述',
        content: '文章內容',
        source: {
          name: '文章來源名稱',
          url: '文章來源網址'
        }
      }
    },
    #swagger.responses[200] = {
      description: '新聞文章資訊',
      schema: {
        status: true,
        message: '新增新聞文章成功'
      }
    }
  */
  createNewsArticle)

export default router

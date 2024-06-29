import express from 'express'
import multer from 'multer'
import { authenticateAdmin } from '../../../controllers/authController'
import { createNewsArticle, getNoticeList, getAllUserOrderList } from '../../../controllers/adminController'
import { adminAuthenticate } from '../../../middleware/authMiddleware'
import { uploadImage, getImageList } from '../../../controllers/uploadController'

const router = express.Router()
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

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

// 以下放需要被驗證的路由
router.use(adminAuthenticate)

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
        title: '文章標題',
        editor: '文章編輯',
        topic: ['文章標籤'],
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
router.get('/order-page',
  /*
    #swagger.tags= ['Admins']
    #swagger.description = '取得訂閱記錄列表'
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
    #swagger.parameters['planType'] = {
      in: 'query',
      type: 'String',
      description: 'month: 年訂閱 | year: 年訂閱',
    },
    #swagger.parameters['orderId'] = {
      in: 'query',
      type: 'String',
      description: '訂單編號',
    },
    #swagger.parameters['userEmail'] = {
      in: 'query',
      type: 'String',
      description: '會員信箱',
    },
    #swagger.responses[200] = {
      description: '訂閱紀錄列表資訊',
      schema: { $ref: '#/definitions/allOrderList' }
    }
  */
  getAllUserOrderList)

router.post('/upload/image', upload.single('file'),
/*
  #swagger.tags= ['Upload']
  #swagger.description = '上傳一張圖片，支援JPG、PNG和GIF格式，大小限制為5MB'
  #swagger.security = [{'api_key': ['apiKeyAuth']}]
  #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['file'] = {
      in: 'formData',
      description: '要上傳的圖片文件',
      name: 'file',
      type: 'file',
      required: true
    }
  #swagger.responses[200] = {
    description: '上傳成功',
    schema: {
      "status": true,
      "message": "上傳成功",
      "data": {
        "imgUrl": "https://storage.goose-admin=16756675200zgdWTJpyeU7BK....."
      }
    }
  }
  #swagger.responses[400] = {
    description: '上傳失敗',
    schema: {
      "status": false,
      "message": "上傳失敗",
      "data": []
    }
  }
*/
  uploadImage)

router.get('/upload/image',
/*
    #swagger.tags = ['Upload']
    #swagger.description = '獲取上傳的圖片列表'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.responses[200] = {
      description: '獲取圖片列表成功',
      schema: {
        "status": true,
        "message": "獲取圖片列表成功",
        "data": [
          {
            "fileName": "images/23e3fbfe-7221-4227-b006-0adc0225802b.png",
            "imgUrl": "https://storage.googleapis.co......"
          },
          {
            "fileName": "images/ecee260f-64c8-49f5-8fe2-b49f56d53785.png",
            "imgUrl": "https://storage.googleapis.com/ne....."
          }
        ]
      }
    }
    #swagger.responses[400] = {
      description: '獲取圖片列表失敗',
      schema: {
        "status": false,
        "message": "獲取圖片列表失敗",
        "data": []
      }
    }
  */
  getImageList)
export default router

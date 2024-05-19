import express from 'express'
import multer from 'multer'
import { uploadImage, getImageList } from '../../../controllers/uploadController'

const router = express.Router()
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

router.post('/image', upload.single('file'),
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

router.get('/image',
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

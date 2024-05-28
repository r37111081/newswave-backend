import express from 'express'
import { authenticateAdmin } from '../../../controllers/authController'
import { createNewsArticle } from '../../../controllers/adminController'

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

router.post('/create-news-article', createNewsArticle)

export default router

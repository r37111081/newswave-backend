import express from 'express'
import {
  authenticateAdmin
} from '../../../controllers/authController'
import { authenticate } from '../../../middleware/authMiddleware'

export const router = express.Router()

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
router.use(authenticate)

export default router

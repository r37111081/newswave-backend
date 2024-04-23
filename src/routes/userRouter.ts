import express from 'express'
import { getUser } from '../controllers/userController'

const router = express.Router()

router.get('/:id'
  /**
     * #swagger.tags = ['Users']
     * #swagger.description  = "取得使用者資料"
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

export default router

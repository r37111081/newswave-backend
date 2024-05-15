import express from 'express'
import {
  registerUser,
  authenticateUser,
  logoutUser
} from '../../../controllers/authController'

const router = express.Router()

router.post(
  '/register',
  /**
         * #swagger.tags = ['Users']
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
  registerUser
)
router.post(
  '/login',
  /**
         * #swagger.tags = ['Users']
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
router.post(
  '/logout',
  /**
         * #swagger.tags = ['Users']
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
  logoutUser
)

export default router

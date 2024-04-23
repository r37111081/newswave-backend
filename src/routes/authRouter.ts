import express from 'express'
import {
  registerUser,
  authenticateUser,
  logoutUser
} from '../controllers/authController'

const router = express.Router()

router.post('/register',
/**
     * #swagger.tags = ['Users']
     * #swagger.description  = "新使用者註冊"
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
  registerUser)
router.post('/login',
/**
     * #swagger.tags = ['Users']
     * #swagger.description  = "使用者登入"
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
  authenticateUser)
router.post('/logout',
/**
     * #swagger.tags = ['Users']
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

export default router

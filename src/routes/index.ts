import { Router } from 'express'
import authRouter from './api/v1/authRouter'
import userRouter from './api/v1/userRouter'
import memberRouter from './api/v1/memberRouter'
import guestRouter from './api/v1/guestRouter'
import { authenticate } from '../middleware/authMiddleware'

const routes = Router()

routes.use('/api/v1/auth', authRouter) // 註冊登入登出
routes.use('/api/v1/guest', guestRouter) // 未登入使用者
routes.use('/api/v1/user', authenticate, userRouter) // 一般使用者
routes.use('/api/v1/member', authenticate, memberRouter) // 訂閱使用者
// routes.use('/api/v1/admin', authenticate, adminRouter)// 後台管理者

export default routes

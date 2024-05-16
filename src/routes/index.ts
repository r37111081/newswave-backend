import { Router } from 'express'
import userRouter from './api/v1/userRouter'
import memberRouter from './api/v1/memberRouter'
import guestRouter from './api/v1/guestRouter'
import { authenticate, vipVerify } from '../middleware/authMiddleware'

const routes = Router()

routes.use('/api/v1/guest', guestRouter) // 未登入使用者
routes.use('/api/v1/user', userRouter) // 一般使用者
routes.use('/api/v1/member', authenticate, vipVerify, memberRouter) // 訂閱使用者
// routes.use('/api/v1/admin', authenticate, adminRouter)// 後台管理者

export default routes

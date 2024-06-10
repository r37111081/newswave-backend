import { Router } from 'express'
import userRouter from './api/v1/userRouter'
import memberRouter from './api/v1/memberRouter'
import guestRouter from './api/v1/guestRouter'
import uploadRouter from './api/v1/uploadRouter'
import orderRouter from './api/v1/orderRouter'
import adminRouter from './api/v1/adminRouter'
import { authenticate, vipVerify } from '../middleware/authMiddleware'

const routes = Router()

routes.use('/api/v1/guest', guestRouter) // 未登入使用者
routes.use('/api/v1/user', userRouter) // 一般使用者
routes.use('/api/v1/upload', authenticate, uploadRouter) // 上傳照片、取得照片列表
routes.use('/api/v1/member', authenticate, vipVerify, memberRouter) // 訂閱使用者
routes.use('/api/v1/order', orderRouter) // 金流相關
routes.use('/api/v1/admin', adminRouter)// 後台管理者

export default routes

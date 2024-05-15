import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger_output.json'

// 遠端資料庫連線
import connectUserDB from './connections/userDB'

// middleware
import { authenticate } from './middleware/authMiddleware'
import { errorHandler } from './middleware/errorMiddleware'

// router
import authRouter from './routes/authRouter'
import userRouter from './routes/userRouter'
import guestRouter from './routes/guestRouter'
import memberRouter from './routes/memberRouter'

// 載入環境變數
dotenv.config()

interface UserBasicInfo {
  _id: string;
  name: string;
  email: string;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

// 創建 Express 應用程式
const app = express()

// 設置 Express 應用程式
app.use(helmet())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 設置 CORS 選項
const corsOptions = {
  origin: process.env.FRONT_END_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}
app.use(cors(corsOptions))

// 設置路由
app.use('/api/v1/auth', authRouter) // 註冊登入登出
app.use('/api/v1/guest', guestRouter) // 一般使用者
app.use('/api/v1/user', authenticate, userRouter) // 登入使用者
app.use('/api/v1/member', authenticate, memberRouter) // 訂閱使用者
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// 錯誤處理相關
app.use(errorHandler)

// 連結mongodb altas 資料庫
connectUserDB()

// 啟動server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger_output.json'

// connections
import connectUserDB from './connections/userDB'

// router
import authRouter from './routes/authRouter'
import userRouter from './routes/userRouter'

// middleware
import { authenticate } from './middleware/authMiddleware'
import { errorHandler } from './middleware/errorMiddleware'

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

const app = express()
const port = process.env.PORT || 8000
app.use(helmet())

const corsOptions = {
  origin: process.env.FRONT_END_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}

app.use(cors(corsOptions))

app.use(cookieParser())

app.use(bodyParser.json()) // To recognize the req obj as a json obj
app.use(bodyParser.urlencoded({ extended: true })) // To recognize the req obj as strings or arrays. extended true to handle nested objects also

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

app.use('/api/v1/member', authRouter)
app.use('/api/v1/member', authenticate, userRouter)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(errorHandler)

connectUserDB()

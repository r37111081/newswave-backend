import express from 'express'
import authRouter from './routes/authRouter'
import connectUserDB from './connections/userDB'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRouter'
import { authenticate } from './middleware/authMiddleware'
import { errorHandler } from './middleware/errorMiddleware'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger_output.json'

dotenv.config()

interface UserBasicInfo {
  _id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

const app = express()
const port = process.env.PORT || 8000
app.use(helmet())

app.use(
  cors({
    credentials: true
  })
)

app.use(cookieParser())

app.use(bodyParser.json()) // To recognize the req obj as a json obj
app.use(bodyParser.urlencoded({ extended: true })) // To recognize the req obj as strings or arrays. extended true to handle nested objects also

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

app.use(authRouter)
app.use('/users', authenticate, userRouter)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
  swaggerOptions: {
    host: 'newswave-backend.onrender.com'
  }
}))

app.use(errorHandler)

connectUserDB()

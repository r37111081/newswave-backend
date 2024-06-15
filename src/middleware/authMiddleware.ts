import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/User'
import asyncHandler from 'express-async-handler'
import { AuthenticationError, appError } from './errorMiddleware'
import { catchAsync } from '../utils/catchAsync'

const getUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers?.authorization?.split('Bearer ')?.[1]

    if (!token) {
      return next()
    }

    const jwtSecret = process.env.JWT_SECRET || ''
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload

    if (!decoded || !decoded.userId) {
      return next()
    }

    const user = await User.findById(decoded.userId, '_id name email planType numberOfReads')

    if (!user) {
      return next()
    }

    req.user = user
    next()
  }
)

const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers?.authorization?.split('Bearer ')?.[1]

      if (!token) {
        throw new AuthenticationError(401, 'Token not found')
      }

      const jwtSecret = process.env.JWT_SECRET || ''
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload

      if (!decoded || !decoded.userId) {
        throw new AuthenticationError(401, 'UserId not found')
      }

      const user = await User.findById(decoded.userId, '_id name email planType numberOfReads')

      if (!user) {
        throw new AuthenticationError(401, 'User not found')
      }

      req.user = user
      next()
    } catch (e) {
      throw new AuthenticationError(401, 'Invalid token')
    }
  }
)

const vipVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.planType === '' && req.user?.numberOfReads === 0) {
    return appError({ statusCode: 401, message: '非訂閱用戶' }, next)
  }
  next()
})

export { authenticate, vipVerify, getUserId }

import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/User'
import asyncHandler from 'express-async-handler'
import { AuthenticationError } from './errorMiddleware'

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

      const user = await User.findById(decoded.userId, '_id name email')

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

export { authenticate }

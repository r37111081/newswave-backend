import { NextFunction } from 'express'

class AppError extends Error {
  statusCode: number
  isOperational: boolean
  constructor (message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    // 確保堆疊跟蹤正確
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
const appError = (apiState: any, next: NextFunction) => {
  const error = new AppError(apiState.message, apiState.statusCode)
  next(error)
}
export { AppError, appError }

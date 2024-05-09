import { NextFunction, Request, Response } from 'express'

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)

  if (err instanceof AuthenticationError) {
    if (err.statusCode === 400) {
      res.status(400).json({ status: false, message: err.message })
    } else {
      res.status(401).json({ status: false, message: 'Unauthorized: ' + err.message })
    }
  } else {
    res.status(500).json({ status: false, message: 'Internal Server Error' })
  }
}

class AuthenticationError extends Error {
  statusCode: number
  isOperational: boolean | undefined
  constructor (statusCode: number, message: string) {
    super(message)
    this.name = 'AuthenticationError'
    this.statusCode = statusCode
    this.isOperational = true
  }
}

const appError = (apiState: any, next: NextFunction) => {
  const error = new AuthenticationError(apiState.statusCode, apiState.message)
  next(error)
}

export { errorHandler, AuthenticationError, appError }

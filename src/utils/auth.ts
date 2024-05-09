import jwt from 'jsonwebtoken'
import { Response } from 'express'

const generateToken = (res: Response, userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || ''
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: '1h'
  })

  return token
}

const clearToken = (res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  })
}

export { generateToken, clearToken }

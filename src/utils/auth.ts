import jwt from 'jsonwebtoken'
import { Response } from 'express'

const generateToken = (res: Response, userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || ''
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: '1h'
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    domain: process.env.FRONT_END_URL?.includes('https://') ? process.env.FRONT_END_URL?.replace('https://', '') : undefined,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000
  })
}

const clearToken = (res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })
}

export { generateToken, clearToken }

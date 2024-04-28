import { Request, Response } from 'express'
import User from '../models/User'

const getUser = async (req: Request, res: Response) => {
  const userId = req.user?._id
  const user = await User.findById(userId, 'name email')

  if (!user) {
    res.status(400)
  }

  res.status(200).json({
    status: true,
    message: '取得成功',
    data: user
  })
}

export { getUser }

import { Request, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcryptjs'

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
// 更新密碼 API
const updatePassword = async (req: Request, res: Response) => {
  const { password, confirmPassword } = req.body
  // 資料欄位正確
  if (!password || !confirmPassword) {
    return res.status(400).json({ error: '資料欄位不正確' })
  }
  // 密碼正確
  if (password !== confirmPassword) {
    return res.status(400).json({ error: '密碼不一致' })
  }
  // 加密密碼
  const newPassword = await bcrypt.hash(password, 8)

  await User.findByIdAndUpdate(req.user, {
    password: newPassword
  }).exec()

  res.status(200).json({
    status: true,
    message: '修改密碼成功'
  })
}
export { getUser, updatePassword }

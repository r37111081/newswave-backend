import { getSocektIo, getOnlineUsers } from '../connections/socket'
import User, { IUser } from '../models/User'
import Notice from '../models/Notice'
import { INews } from '../models/News'

// 發布通知
const postNotice = async (updates: string[], title?: string) => {
  updates.forEach((uid: string) => {
    const userId = uid.toString()
    const socketId = getOnlineUsers()[userId]
    if (socketId) {
      getSocektIo().to(socketId).emit('notice', {
        action: 'create',
        receive: true,
        title
      })
    }
  })
}

// 使用者系統通知
export const postSystemNotice = async (data: any, userId: string) => {
  const newNotice = await Notice.create({
    title: data.title,
    content: data.content,
    publishedAt: data.publishedAt
  })

  await User.findByIdAndUpdate(userId, {
    $addToSet: { notices: { noticeId: newNotice._id } }
  })
  postNotice([userId], newNotice.title)
}

// 使用者追蹤通知
export const postFollowNotice = async (data: INews) => {
  const newNotice = await Notice.create({
    articleId: data.articleId,
    topic: data.topic,
    title: data.title,
    content: data.content,
    publishedAt: data.publishedAt
  })

  const users = await User.find({ follows: { $in: data.topic } })

  const updates = users.map((user: IUser) => user._id)

  await User.updateMany(
    { _id: { $in: updates } },
    { $addToSet: { notices: { noticeId: newNotice._id } } }
  )
  postNotice(updates, newNotice.title)
}

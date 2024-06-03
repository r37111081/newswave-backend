import { getSocektIo, getOnlineUsers } from '../connections/socket'
import User, { IUser } from '../models/User'
import Notice from '../models/Notice'
import { INews } from '../models/News'
import { formatToDate } from '../utils/helper'

// 發布通知
const postNotice = async (updates: { id:string, unreadNum: Number }[], title?: string) => {
  updates.forEach((user) => {
    const { id, unreadNum } = user
    const userId = id.toString()
    const socketId = getOnlineUsers()[userId]
    if (socketId) {
      getSocektIo().to(socketId).emit('notice', {
        action: 'create',
        receive: true,
        unreadNum,
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
    publishedAt: formatToDate()
  })

  const user = await User.findByIdAndUpdate(userId, {
    $addToSet: { notices: { noticeId: newNotice._id } }
  }, { new: true, runValidators: true })
  if (!user) throw new Error('User not found')

  const updates = [
    {
      id: userId,
      unreadNum: user.notices.filter(notice => !notice.read).length
    }
  ]
  postNotice(updates, newNotice.title)
}

// 使用者追蹤通知
export const postFollowNotice = async (data: INews) => {
  const newNotice = await Notice.create({
    articleId: data.articleId,
    topic: data.topic,
    title: data.title,
    content: data.content,
    publishedAt: formatToDate()
  })

  const users = await User.find({ follows: { $in: data.topic } })
  const updateIds = users.map((user: IUser) => user._id)

  const updates = users.map((user: IUser) => ({
    id: user._id,
    unreadNum: user.notices.filter(notice => !notice.read).length
  }))

  await User.updateMany(
    { _id: { $in: updateIds } },
    { $addToSet: { notices: { noticeId: newNotice._id } } }
  )
  postNotice(updates, newNotice.title)
}

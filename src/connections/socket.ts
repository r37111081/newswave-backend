import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'

const originList: string[] = [process.env.FRONT_END_URL || '', process.env.FRONT_END_ADMIN_URL || '']

let onlineUsers: { [userId: string]: string } = {}
let io: Server
export const connectSocketIo = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: originList,
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
  io.on('connection', (socket: Socket) => {
    console.log('SocketIo Client connected')

    const userId = socket.handshake.query.userId as string
    onlineUsers[userId] = socket.id

    socket.on('disconnect', () => {
      delete onlineUsers[userId]
    })
  })
}
export const getSocektIo = () => {
  if (!io) {
    throw new Error('SocketIo 發生錯誤')
  }
  return io
}
export const getOnlineUsers = () => onlineUsers

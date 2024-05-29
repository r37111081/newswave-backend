import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

let io: any
export function connectSocketIo (server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:4000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
  io.on('connection', (socket: any) => {
    console.log('Client connected')
  })
}
export function getSocektIo () {
  if (!io) {
    throw new Error('Socket.io is not initialized')
  }
  return io
}

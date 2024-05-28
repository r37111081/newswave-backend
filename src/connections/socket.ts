import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

let io: any
export function connectSocketIo (server: HttpServer) {
  io = new Server(server)
  io.on('connection', socket => {
    console.log('Client connected')
  })
}
export function getSocektIo () {
  if (!io) {
    throw new Error('Socket.io is not initialized')
  }
  return io
}

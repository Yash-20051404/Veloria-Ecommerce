import type { Server as SocketIOServer } from 'socket.io'

export function registerSocketHandlers(io: SocketIOServer) {
  io.on('connection', (socket) => {
    socket.emit('system:ready', { message: 'Socket scaffold ready' })
  })
}

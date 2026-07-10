import type { Server as HttpServer } from 'node:http'
import { Server as SocketIOServer } from 'socket.io'
import { env } from '@/config/env'

export function createSocketServer(server: HttpServer) {
  return new SocketIOServer(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  })
}

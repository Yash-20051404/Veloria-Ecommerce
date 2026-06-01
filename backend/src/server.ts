import { createServer } from 'node:http'
import { createApp } from '@/app'
import { connectDatabase } from '@/config/database'
import { env } from '@/config/env'
import { createSocketServer } from '@/config/socket'
import { registerSocketHandlers } from '@/sockets'
import { logger } from '@/utils/logger'

async function bootstrap() {
  await connectDatabase()

  const app = createApp()
  const server = createServer(app)
  const io = createSocketServer(server)

  registerSocketHandlers(io)

  server.listen(env.port, () => {
    logger.info(`NovaKicks API running on port ${env.port}`)
  })
}

bootstrap().catch((error: Error) => {
  logger.error(`Failed to bootstrap server: ${error.message}`)
  process.exit(1)
})

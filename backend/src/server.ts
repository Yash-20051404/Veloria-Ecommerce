import { createServer } from 'node:http'
import { createApp } from '@/app'
import { connectDatabase } from '@/config/database'
import { env } from '@/config/env'
import { createSocketServer } from '@/config/socket'
import { registerSocketHandlers } from '@/sockets'
import { logger } from '@/utils/logger'
import { hybridSearchService } from '@/services/hybridSearch.service'

async function bootstrap() {
  await connectDatabase()

  const app = createApp()
  const server = createServer(app)
  const io = createSocketServer(server)

  registerSocketHandlers(io)

  // Initialize hybrid search engine (loads model, builds TF-IDF index, caches embeddings)
  // This runs asynchronously — the server starts immediately, search becomes ready in background
  hybridSearchService.initialize().then(() => {
    logger.info(`Hybrid search engine initialized and ready`)
  }).catch((error: Error) => {
    logger.warn(`Hybrid search engine initialization failed: ${error.message}. Search will use fallback.`)
  })

  server.listen(env.port, () => {
    logger.info(`NovaKicks API running on port ${env.port}`)
  })
}

bootstrap().catch((error: Error) => {
  logger.error(`Failed to bootstrap server: ${error.message}`)
  process.exit(1)
})

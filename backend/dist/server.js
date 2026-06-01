"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const app_1 = require("./app");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const socket_1 = require("./config/socket");
const sockets_1 = require("./sockets");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    await (0, database_1.connectDatabase)();
    const app = (0, app_1.createApp)();
    const server = (0, node_http_1.createServer)(app);
    const io = (0, socket_1.createSocketServer)(server);
    (0, sockets_1.registerSocketHandlers)(io);
    server.listen(env_1.env.port, () => {
        logger_1.logger.info(`NovaKicks API running on port ${env_1.env.port}`);
    });
}
bootstrap().catch((error) => {
    logger_1.logger.error(`Failed to bootstrap server: ${error.message}`);
    process.exit(1);
});

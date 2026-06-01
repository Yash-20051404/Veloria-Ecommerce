"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = createSocketServer;
const socket_io_1 = require("socket.io");
const env_1 = require("../config/env");
function createSocketServer(server) {
    return new socket_io_1.Server(server, {
        cors: {
            origin: env_1.env.clientUrl,
            credentials: true,
        },
    });
}

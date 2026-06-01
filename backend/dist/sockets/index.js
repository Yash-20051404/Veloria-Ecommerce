"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketHandlers = registerSocketHandlers;
function registerSocketHandlers(io) {
    io.on('connection', (socket) => {
        socket.emit('system:ready', { message: 'Socket scaffold ready' });
    });
}

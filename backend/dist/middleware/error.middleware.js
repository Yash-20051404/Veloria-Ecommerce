"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
function errorHandler(error, _req, res, _next) {
    logger_1.logger.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
}

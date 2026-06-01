"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
async function connectDatabase() {
    if (!env_1.env.mongoUri) {
        throw new Error('MONGODB_URI is missing');
    }
    await mongoose_1.default.connect(env_1.env.mongoUri);
    logger_1.logger.info('MongoDB connected');
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 5000),
    mongoUri: process.env.MONGODB_URI ?? '',
    jwtSecret: process.env.JWT_SECRET ?? 'unsafe-dev-secret',
    clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        req.auth = payload;
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}

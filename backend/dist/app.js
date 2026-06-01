"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./routes");
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: env_1.env.clientUrl,
        credentials: true,
    }));
    app.use((0, helmet_1.default)());
    app.use((0, morgan_1.default)('dev'));
    app.use(express_1.default.json());
    app.get('/', (_req, res) => {
        res.status(200).json({
            service: 'novakicks-api',
            version: 'v1',
            message: 'API foundation running',
        });
    });
    app.use('/api/v1', routes_1.apiRoutes);
    app.use(notFound_middleware_1.notFoundHandler);
    app.use(error_middleware_1.errorHandler);
    return app;
}

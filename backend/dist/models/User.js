"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const roles_1 = require("../types/roles");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(roles_1.UserRole),
        default: roles_1.UserRole.BUYER,
        required: true,
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);

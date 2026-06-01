"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapAuthSeed = bootstrapAuthSeed;
const roles_1 = require("../types/roles");
async function bootstrapAuthSeed() {
    return {
        initialized: true,
        defaultRole: roles_1.UserRole.BUYER,
    };
}

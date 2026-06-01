"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
function requireRole(allowed) {
    return (req, res, next) => {
        const userRole = req.auth?.role;
        if (!userRole || !allowed.includes(userRole)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    };
}

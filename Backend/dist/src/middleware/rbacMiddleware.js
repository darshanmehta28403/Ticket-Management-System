"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = void 0;
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Authentication required." });
        }
        const { permissions } = req.user;
        if (!permissions || !permissions.includes(permission)) {
            return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
        }
        next();
    };
};
exports.requirePermission = requirePermission;

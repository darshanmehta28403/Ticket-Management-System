"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../model/prisma");
const JWT_SECRET = process.env.JWT_SECRET || "flowbit_jwt_secret_key";
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Fetch user with their role and role permissions
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId, active: true },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                },
                project: true
            }
        });
        if (!user) {
            return res.status(401).json({ message: "User not found or is inactive." });
        }
        // Flatten permission names to make checks easier
        const permissions = user.role.permissions
            .filter((rp) => rp.active && rp.permission.active)
            .map((rp) => rp.permission.name);
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.title,
            projectId: user.projectId,
            permissions
        };
        next();
    }
    catch (error) {
        console.error("JWT Auth error:", error);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};
exports.authenticateJWT = authenticateJWT;

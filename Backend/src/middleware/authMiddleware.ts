import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../model/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "flowbit_jwt_secret_key";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // Fetch user with their role and role permissions
    const user = await prisma.user.findUnique({
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
  } catch (error: any) {
    console.error("JWT Auth error:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

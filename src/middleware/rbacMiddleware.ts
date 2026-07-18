import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./authMiddleware";

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

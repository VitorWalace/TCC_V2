import { Request, Response, NextFunction } from "express";
import { SecurityUtils } from "../utils/security";
import { JwtPayload, ApiResponse } from "../types";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token de acesso é obrigatório",
      } as ApiResponse);
      return;
    }

    const decoded = SecurityUtils.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Token inválido";
    
    res.status(401).json({
      success: false,
      message: errorMessage,
    } as ApiResponse);
  }
};

/**
 * Middleware to check if user has specific role
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Utilizador não autenticado",
        } as ApiResponse);
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: "Não tem permissão para aceder a este recurso",
        } as ApiResponse);
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro interno no servidor",
      } as ApiResponse);
    }
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = requireRole(["admin"]);

/**
 * Middleware to check if user is instructor or admin
 */
export const requireInstructor = requireRole(["instructor", "admin"]);

/**
 * Middleware to check if user can access their own profile or is admin
 */
export const requireSelfOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Utilizador não autenticado",
      } as ApiResponse);
      return;
    }

    const targetUserId = req.params.userId || req.params.id;
    
    // User can access their own data or admin can access any data
    if (req.user.userId === targetUserId || req.user.role === "admin") {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: "Não tem permissão para aceder a este recurso",
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno no servidor",
    } as ApiResponse);
  }
};

/**
 * Middleware for optional authentication (user can be logged in or not)
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      try {
        const decoded = SecurityUtils.verifyToken(token);
        req.user = decoded;
      } catch (error) {
        // Token is invalid, but we continue without user
        req.user = undefined;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

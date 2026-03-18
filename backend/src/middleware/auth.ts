import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/http.js";

interface JwtPayload {
  id: number;
  email: string;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "change-this-secret",
    ) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch {
    return next(new AppError("Invalid token", 401));
  }
}

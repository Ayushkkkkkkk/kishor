import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/http.js";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error("[server_error]", error);
  return res.status(500).json({
    message: "Internal server error",
  });
}

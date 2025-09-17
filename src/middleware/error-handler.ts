import CustomError from "@/types/custom-error";
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.status).json({
      success: false,
      error: {
        type: err.name || "CustomError",
        message: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      },
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: { type: "CastError", message: "Malformatted id" },
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: { type: "ValidationError", message: err.message },
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: { type: "Unauthorized", message: "Invalid token" },
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: { type: "Unauthorized", message: "Token expired" },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      type: "InternalServerError",
      message: "Something went wrong",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

export default errorHandler;

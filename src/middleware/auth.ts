import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/user";

export const optionalVerifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      password: string;
    };

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error("User not found, token i");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
  }
};

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      password: string;
    };

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error("User not found, token i");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
  }
};

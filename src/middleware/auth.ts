import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/user";
import { assert } from "@/utils/assert";

// Middleware käyttäjän todennukseen
// Jos pyyntö sisältää validin tokenin, liitetään käyttäjä req-olioon
// Jos token puuttuu tai on virheellinen, siirrytään eteenpäin ilman käyttäjää
export const optionalVerifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Jos Authorization header puuttuu, siirrytään eteenpäin
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return next();
    }

    // Jos token on olemassa, tarkistetaan se
    const jwtSecret = process.env.JWT_SECRET;
    assert(
      jwtSecret,
      500,
      "JWT_SECRET is not defined in the environment variables"
    );

    // Tarkistetaan tokenin validius
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      password: string;
    };
    assert(decoded, 401, "Invalid token");

    // Haetaan käyttäjä tietokannasta tokenin id:n perusteella
    const user = await User.findById(decoded.id);
    assert(user, 404, "User not found, token is invalid");

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware käyttäjän todennukseen
export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Jos Authorization header puuttuu, heitetään virhe
    const token = req.header("Authorization")?.split(" ")[1];
    assert(token, 401, "No token provided");

    // Jos token on olemassa, tarkistetaan se
    const jwtSecret = process.env.JWT_SECRET;
    assert(
      jwtSecret,
      500,
      "JWT_SECRET is not defined in the environment variables"
    );

    // Tarkistetaan tokenin validius
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      password: string;
    };
    assert(decoded, 401, "Invalid token");

    // Haetaan käyttäjä tietokannasta tokenin id:n perusteella
    const user = await User.findById(decoded.id);
    assert(user, 404, "User not found, token is invalid");

    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    next(error);
  }
};

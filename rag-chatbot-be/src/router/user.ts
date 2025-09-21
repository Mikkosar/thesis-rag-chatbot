import User from "../models/user";
import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { assert } from "@/utils/assert";
dotenv.config();

const router = express.Router();

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      assert(email && password, 400, "Email and password are required");

      // Etsi käyttäjä sähköpostilla ja tarkista salasana
      const user = await User.findOne({ email });
      const isPasswordValid =
        user === null ? false : await bcrypt.compare(password, user.password);
      assert(user && isPasswordValid, 401, "Invalid email or password");

      // Luo JWT-token
      const jwtSecret = process.env.JWT_SECRET;
      assert(jwtSecret, 500, "JWT secret not configured");
      const forToken = {
        id: user._id,
        email: user.email,
        password: user.password,
      };
      const token = jwt.sign(forToken, jwtSecret, { expiresIn: 60 * 60 }); // Token valid for 1 hour
      assert(token, 500, "Failed to generate token");

      return res.status(200).json({
        token: token,
        userId: user._id,
        firstname: user.firstName,
        email: user.email,
      });
    } catch (error) {
      console.error("Error processing user route:", error);
      return next(error);
    }
  }
);

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      assert(
        firstName && lastName && email && password,
        400,
        "All fields are required"
      );

      // Tarkista, onko käyttäjä jo olemassa
      const doesUserExist = await User.findOne({ email });
      assert(!doesUserExist, 409, "User with this email already exists");

      // Luo uusi käyttäjä ja tallenna tietokantaan
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHash,
      });
      const savedUser = await newUser.save();
      assert(savedUser, 500, "Failed to save user");

      return res.status(201).json({
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      });
    } catch (error) {
      console.error("Error processing user route:", error);
      return next(error);
    }
  }
);

export default router;

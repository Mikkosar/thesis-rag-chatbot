import User from "../models/user";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    const isPasswordValid =
      user === null ? false : await bcrypt.compare(password, user.password);
    if (!user || !isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const forToken = {
      email: user.email,
      password: user.password,
    };

    const token = jwt.sign(forToken, jwtSecret, { expiresIn: 60 * 60 }); // Token valid for 1 hour

    return res
      .status(200)
      .json({
        token: token,
        userId: user._id,
        firstname: user.firstName,
        email: user.email,
      });
  } catch (error) {
    console.error("Error processing user route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const doesUserExist = await User.findOne({ email });
    if (doesUserExist) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error processing user route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await User.find({}).populate("chatLogs");
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate("chatLogs");
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

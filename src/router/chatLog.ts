import { verifyToken } from "@/middleware/auth";
import ChatLog from "../models/chatLog";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user.id;
    const chatLog = await ChatLog.findOne({ userId: userId });
    return res.json(chatLog);
  } catch (error) {
    console.error("Error fetching chat logs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const chatLogToDelete = await ChatLog.findById(id);

    if (!chatLogToDelete) {
      return res.status(404).json({ error: "Chat log not found" });
    }

    if (req.user.id !== chatLogToDelete.userId.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const deletedChatLog = await ChatLog.findByIdAndDelete(id);
    if (deletedChatLog) {
      return res.json({ message: "Chat log deleted successfully" });
    } else {
      return res.status(404).json({ error: "Chat log not found" });
    }
  } catch (error) {
    console.error("Error deleting chat log:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

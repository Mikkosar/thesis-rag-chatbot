import ChatLog from "../models/chatLog";
import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const chatLog = await ChatLog.find({ userId });
    return res.json(chatLog);
  } catch (error) {
    console.error("Error fetching chat logs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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

import { verifyToken } from "@/middleware/auth";
import ChatLog from "../models/chat-log";
import express, { NextFunction, Request, Response } from "express";
import { assert } from "@/utils/assert";
import CustomError from "@/types/custom-error";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        assert(req.user, 401, "Unauthorized");
      }

      // Haetaan käyttäjän chat-logit
      const userId = req.user.id;
      const chatLog = await ChatLog.find({ userId: userId });
      assert(chatLog, 404, "No chat logs found for user");

      return res.json(chatLog);
    } catch (error) {
      console.error("Error fetching chat logs:", error);
      return next(error);
    }
  }
);

router.delete(
  "/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      assert(id, 400, "Chat log ID is required");

      // Varmistetaan, että chat-logi kuuluu kirjautuneelle käyttäjälle
      const chatLogToDelete = await ChatLog.findById(id);
      assert(chatLogToDelete, 401, "Chat log not found");

      if (req.user.id !== chatLogToDelete.userId.toString()) {
        next(new CustomError(401, "Unauthorized"));
      }

      // Poistetaan chat-logi
      const deletedChatLog = await ChatLog.findByIdAndDelete(id);

      // Palautetaan onnistumisviesti
      if (deletedChatLog) {
        return res.json({ message: "Chat log deleted successfully" });
      } else {
        return assert(deletedChatLog, 404, "Chat log not found");
      }
    } catch (error) {
      console.error("Error deleting chat log:", error);
      next(new CustomError(500, "Internal Server Error"));
    }
  }
);

export default router;

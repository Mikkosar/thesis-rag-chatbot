import chunk from "./chunk";
import chat from "./chat";
import user from "./user";
import chatLog from "./chatLog";

import { Router } from "express";

const router = Router();

router.get("/ping", (_req, res) => {
  res.send("pong!");
});

router.use("/chunk", chunk);
router.use("/chat", chat);
router.use("/user", user);
router.use("/chatLog", chatLog);

export default router;

import chunk from "./chunk";
import chat from "./chat";
import { Router } from "express";

const router = Router();

router.get("/ping", (_req, res) => {
  res.send("pong!");
});

router.use("/chunk", chunk);
router.use("/chat", chat);

export default router;

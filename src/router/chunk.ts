import { getEmbedding } from "../services/embedding";
import Chunk from "../models/chunk";
import express from "express";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const chunks = await Chunk.find({});
    return res.json(chunks);
  } catch (error) {
    console.error("Error fetching chunks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const chunk = await Chunk.findById(req.params.id);
    if (chunk) {
      return res.json(chunk);
    }
    return res.status(404).json({ error: "Chunk not found" });
  } catch (error) {
    console.error("Error fetching chunk:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("TAALLA");
    console.log(req.body);
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const embedding = await getEmbedding(content);

    const newChunk = new Chunk({
      title: title,
      content: content,
      embedding: embedding,
    });

    const savedChunk = await newChunk.save();
    return res.status(201).json(savedChunk);
  } catch (error) {
    console.error("Error creating chunk:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

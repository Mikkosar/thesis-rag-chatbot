import { getEmbedding } from "../services/embedding";
import Chunk from "../models/chunk";
import express, { NextFunction, Request, Response } from "express";
import { assert } from "@/utils/assert";
import { createChunks } from "@/services/chunk-creation";

const router = express.Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Haetaan kaikki chunkit ilman embedding-kenttää
    const chunks = await Chunk.find({}).select("-embedding");
    assert(chunks, 404, "No chunks found");
    return res.json(chunks);
  } catch (error) {
    console.error("Error fetching chunks:", error);
    return next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Haetaan chunk ID:llä ilman embedding-kenttää
    const chunk = await Chunk.findById(req.params.id);
    assert(chunk, 404, "Chunk not found");
    return res.status(404).json({ error: "Chunk not found" });
  } catch (error) {
    console.error("Error fetching chunk:", error);
    return next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    assert(title && content, 400, "Title and content are required");

    // Generoi embedding sisällöstä
    const embedding = await getEmbedding(content);
    assert(embedding, 500, "Failed to generate embedding");

    // Luo ja tallenna uusi chunk
    const newChunk = new Chunk({
      title: title,
      content: content,
      embedding: embedding,
    });
    const savedChunk = await newChunk.save();
    assert(savedChunk, 500, "Failed to save chunk");

    return res.status(201).json(savedChunk);
  } catch (error) {
    console.error("Error creating chunk:", error);
    return next(error);
  }
});

router.post("/multiple", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const x: string = req.body.text;
    assert(x, 400, "Input text is required");

    const chunks = await createChunks(x);
    assert(chunks, 500, "Failed to create chunks");
    return res.status(201).json(chunks);
  } catch (error) {
    console.error("Error creating chunks:", error);
    return next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      assert(id, 400, "ID is required");

      // Poista chunk ID:llä
      const chunk = await Chunk.findByIdAndDelete(req.params.id);
      if (chunk) {
        return res.status(204).send();
      }
      return res.status(404).json({ error: "Chunk not found" });
    } catch (error) {
      console.error("Error deleting chunk:", error);
      return next(error);
    }
  }
);

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;

    assert(title || content, 400, "Title or content must be provided");

    if (content) {
      // Päivitä chunk ja generoi uusi embedding, jos sisältö on päivitetty
      const embedding = await getEmbedding(content);
      const chunk = await Chunk.findByIdAndUpdate(
        req.params.id,
        { title, content, embedding },
        { new: true }
      );
      assert(chunk, 404, "Chunk not found");
      return res.json(chunk);
    } else {
      // Päivitä chunkin title ilman uuden embeddingin generointia
      const chunk = await Chunk.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true }
      );
      assert(chunk, 404, "Chunk not found");
      return res.json(chunk);
    }
  } catch (error) {
    console.error("Error updating chunk:", error);
    return next(error);
  }
});

export default router;

import mongoose from "mongoose";
const { Schema } = mongoose;

const ChunkSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  embedding: {
    type: [Number],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

ChunkSchema.set("toJSON", {
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete (returnedObject as any)._id;
    delete (returnedObject as any).__v;
  },
});

const Chunk = mongoose.model("Chunk", ChunkSchema);
export default Chunk;

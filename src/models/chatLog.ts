import mongoose, { Document, Model } from "mongoose";
const { Schema } = mongoose;

interface IChatLog extends Document {
  messages: { role: string; content: string }[];
  createdAt: Date;
  userId: mongoose.Types.ObjectId;
}

const ChatLogSchema = new Schema<IChatLog>({
  messages: [
    {
      _id: false,
      role: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

ChatLogSchema.set("toJSON", {
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete (returnedObject as any)._id;
    delete (returnedObject as any).__v;
  },
});

const ChatLog: Model<IChatLog> = mongoose.model<IChatLog>(
  "ChatLog",
  ChatLogSchema
);
export default ChatLog;

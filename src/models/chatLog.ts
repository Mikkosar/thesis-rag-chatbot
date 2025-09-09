import { IMessage } from "@/types/chatLogTypes";
import mongoose, { Model } from "mongoose";
const { Schema } = mongoose;

export interface IChatLog extends Document {
  messages: IMessage[];
  createdAt: Date;
  userId: mongoose.Types.ObjectId;
}

const ChatLogSchema = new Schema<IChatLog>({
  messages: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true,
      },
      content: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

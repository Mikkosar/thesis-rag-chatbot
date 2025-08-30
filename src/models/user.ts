import mongoose, { Document, Model } from "mongoose";
const { Schema } = mongoose;

interface IUser extends Document {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  createdAt: Date;
  chatLogs: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  chatLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatLog" }],
});

UserSchema.set("toJSON", {
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete (returnedObject as any)._id;
    delete (returnedObject as any).__v;
  },
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;

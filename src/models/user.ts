import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.set("toJSON", {
    transform: (_document, returnedObject: any) => {
      returnedObject.id = returnedObject._id.toString();
      delete (returnedObject as any)._id;
      delete (returnedObject as any).__v;
    },
});

const User = mongoose.model("User", UserSchema);
export default User;
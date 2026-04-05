import mongoose from "mongoose";
// we have to extend the Document interface to include mongoose
// document properties and methods (like _id, save, etc.)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
  monthlySpendingLimit: {
    type: Number,
    min: 0,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

export default User;

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    msg: { type: String, required: true },
    profilePic: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;

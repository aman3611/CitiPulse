const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: {
      type: String,
      enum: ["user", "government", "admin"],
      required: true,
    },
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);

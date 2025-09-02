const mongoose = require("mongoose");

const socialShareSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  platform: { type: String }, // e.g., "Twitter", "WhatsApp"
  sharedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SocialShare", socialShareSchema);

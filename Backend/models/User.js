const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  landmark: { type: String },
  profilePhoto: { type: String },
  bio: { type: String },
  socialLinks: {
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String },
  },
  role: { type: String, enum: ["user"], default: "user" },
  isVerified: { type: Boolean, default: false },
  upvotedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  downvotedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("User", userSchema);

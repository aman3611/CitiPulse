const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userRole: {
    type: String,
    enum: ["user", "government", "admin"],
    required: true,
  },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  userProfilePhoto: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userRole: {
    type: String,
    enum: ["user", "government", "admin"],
    required: true,
  },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  userProfilePhoto: { type: String },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
});

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    caption: { type: String, trim: true },

    images: [imageSchema],

    location: {
      country: { type: String, default: "India" },
      state: { type: String, required: true },
      landmark: { type: String, trim: true },
      address: { type: String, trim: true },
      pincode: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    currentState: {
      type: String,
      enum: ["In Progress", "Resolved"],
      default: "In Progress",
    },

    finalUpdate: {
      caption: { type: String },
      images: [imageSchema],
    },

    progressState: {
      type: String,
      enum: [
        "Unseen",
        "Problem Seen",
        "Verified",
        "Work Started",
        "Work Near Completion",
        "Waiting for User Verification",
        "Finished",
      ],
      default: "Unseen",
    },

    assignedGovernment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Government",
      default: null,
    },

    comments: [commentSchema],

    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

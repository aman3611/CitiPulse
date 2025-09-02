const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authenticateToken = require("../middleware/authenticateToken");
const {
  registerUser,
  loginUser,
  profileUser,
  updateProfile,
  profilePhoto,
  verifyPostCompletion,
  sendMessage,
  getMessages,
  getUpvotedPosts,
  getDownvotedPosts
} = require("../controllers/userController");
const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  addComment,
  addReply,
  deleteComment,
  deleteReply,
} = require("../controllers/postController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile/user/:userId", authenticateToken, profileUser);
router.put(
  "/updateProfile",
  upload.single("file"),
  authenticateToken,
  updateProfile
);
router.post(
  "/createPost",
  upload.array("images"),
  authenticateToken,
  createPost
);
router.get("/allPosts", authenticateToken, getAllPosts);
router.put(
  "/editPosts/:id",
  upload.array("images"),
  authenticateToken,
  updatePost
);
router.delete("/deletePosts/:id", authenticateToken, deletePost);
router.put("/verifyPost/:id", authenticateToken, verifyPostCompletion);
// routes/userRoutes.js

router.delete(
  "/deleteComment/:postId/:commentIndex",
  authenticateToken,
  deleteComment
);
router.delete(
  "/deleteReply/:postId/:commentIndex/:replyIndex",
  authenticateToken,
  deleteReply
);

router.post("/sendMessage", authenticateToken, sendMessage);
router.get("/getMessage", authenticateToken, getMessages);

router.get("/upvotedPosts", authenticateToken, getUpvotedPosts);
router.get("/downvotedPosts", authenticateToken, getDownvotedPosts);

module.exports = router;

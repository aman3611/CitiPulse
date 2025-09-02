const express = require("express");
const router = express.Router();
const {
  addComment,
  addReply,
  deleteComment,
  deleteReply,
  votePost,
  getPostById,
} = require("../controllers/postController");
const authenticateToken = require("../middleware/authenticateToken");

// Add Comment
router.post("/addComment", authenticateToken, addComment);
router.post("/addReply", authenticateToken, addReply);

router.delete("/deleteComment", authenticateToken, deleteComment);
router.delete("/deleteReply", authenticateToken, deleteReply);

router.put("/votePost", authenticateToken, votePost);

router.get("/post/:postId", authenticateToken, getPostById);

module.exports = router;

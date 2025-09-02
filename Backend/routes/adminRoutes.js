const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController");
const authenticateToken = require("../middleware/authenticateToken");
const {getAllPosts} = require("../controllers/postController");
const { deletePost, getAllUsers, deleteUser ,getAllGovernments, deleteGovernment, verifyGovernment} = require("../controllers/adminController");


router.post("/login", loginAdmin);
router.get("/allPosts", authenticateToken, getAllPosts);
router.delete("/deletePosts/:id", authenticateToken, deletePost);
router.get("/allUsers", authenticateToken, getAllUsers);
router.delete("/deleteUser/:id", authenticateToken, deleteUser);
router.get("/allGovernments", authenticateToken, getAllGovernments);
router.delete("/deleteGovernment/:id", authenticateToken, deleteGovernment);
router.put("/verifyGovernment/:id", authenticateToken, verifyGovernment);


module.exports = router;

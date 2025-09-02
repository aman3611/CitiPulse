const express = require("express");
const router = express.Router();
const {
  registerGov,
  loginGov,
  profileGov,
  updateProfileGov,
  allPosts,
  progressState,
  updateFinalWork,
  regressProgressState,
} = require("../controllers/governmentController");
const upload = require("../middleware/upload");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/signup", upload.single("proofDoc"), registerGov);
router.post("/login", loginGov);
router.get("/profile/government/:userId", authenticateToken, profileGov);
router.put(
  "/updateProfile",
  upload.single("profilePhoto"),
  authenticateToken,
  updateProfileGov
);
router.get("/allPosts", authenticateToken, allPosts);
router.put("/progressState/:id", authenticateToken, progressState);
router.put(
  "/updateFinalWork/:id",
  upload.array("images"),
  authenticateToken,
  updateFinalWork
);

router.put("/regressProgressState/:id", authenticateToken, regressProgressState);

module.exports = router;

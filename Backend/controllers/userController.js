const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const imagekit = require("../utils/imagekit");
const Post = require("../models/Post");
const Government = require("../models/Government");
const Chat = require("../models/Chat");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash: hashedPassword,
  });

  const token = jwt.sign(
    { id: user._id, role: "user", email: user.email, name: user.name },
    process.env.JWT_SECRET
  );
  res.json({ token });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: user._id,
      role: "user",
      email: user.email,
      name: user.name,
      profilePhoto: user.profilePhoto,
    },
    process.env.JWT_SECRET
  );
  res.json({ token });
};

exports.profileUser = async (req, res) => {
  try {
    const id = req.params.userId; // Assuming you use JWT middleware and set req.user
    console.log(id);

    const user = await User.findById(id).select("-passwordHash -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);

    res.status(200).json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update all allowed fields
    const allowedFields = [
      "name",
      "email",
      "phone",
      "dob",
      "gender",
      "address",
      "city",
      "state",
      "pincode",
      "landmark",
      "bio",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Handle socialLinks as JSON string if present
    if (req.body.socialLinks) {
      try {
        user.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (e) {
        /* fallback or ignore */
      }
    }

    // Handle profile photo
    if (req.file) {
      try {
        const imageData = await imagekit.upload({
          file: req.file.buffer,
          fileName: `${Date.now()}-${req.file.originalname}`,
        });
        user.profilePhoto = imageData.url;
      } catch (err) {
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    await user.save();
    const userObj = user.toObject();
    delete userObj.passwordHash;
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: userObj });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/userController.js

exports.verifyPostCompletion = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found." });
    if (post.user.toString() !== userId)
      return res
        .status(403)
        .json({ message: "You are not authorized to verify this post." });

    if (post.progressState !== "Waiting for User Verification") {
      return res
        .status(400)
        .json({ message: "Post is not ready for user verification." });
    }

    post.progressState = "Finished";
    post.currentState = "Resolved";

    if (post.assignedGovernment) {
      await Government.findByIdAndUpdate(post.assignedGovernment, {
        $inc: { resolvedIssuesCount: 1 },
      });
    }

    await post.save();

    res.status(200).json({ message: "Post marked as Finished successfully." });
  } catch (error) {
    console.error("User verification failed:", error);
    res.status(500).json({ message: "Server error during post verification." });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { msg } = req.body;
    const tokenUser = req.user; // From middleware
    console.log("ye hai", tokenUser);

    if (!msg)
      return res.status(400).json({ message: "Message content is required" });

    // Fetch full user details from DB to get profilePhoto
    const userData = await User.findById(tokenUser.id);
    if (!userData) return res.status(404).json({ message: "User not found" });

    const newMessage = new Chat({
      user: userData.name,
      msg,
      profilePic: userData.profilePhoto || "", // Now it will work
      userId: userData._id,
    });

    await newMessage.save();

    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUpvotedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const upvotedPosts = await Post
      .find({ upvotes: userId })
      .populate("user", "name email role profilePhoto")
      .sort({ createdAt: -1 });
      
    return res.status(200).json({
      success: true,
      upvotedPosts,
    });
  } catch (error) {
    console.error("Error fetching upvoted posts:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getDownvotedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const downvotedPosts = await Post.find({ downvotes: userId })
      .populate("user", "name email role profilePhoto") // This is the fix
      .sort({ createdAt: -1 });

    console.log("Downvoted posts:", downvotedPosts);

    return res.status(200).json({
      success: true,
      downvotedPosts,
    });
  } catch (error) {
    console.error("Error fetching downvoted posts:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

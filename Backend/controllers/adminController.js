const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const imagekit = require("../utils/imagekit");
const User = require("../models/User");
const streamifier = require("streamifier");
const Government = require("../models/Government");

exports.loginAdmin = async (req, res) => {
  const { email, password, secretKey } = req.body;

  const isFirstAdmin =
    email === process.env.FIRST_ADMIN_EMAIL &&
    password === process.env.FIRST_ADMIN_PASSWORD &&
    secretKey === process.env.ADMIN_SECRET_KEY;

  const isSecondAdmin =
    email === process.env.SECOND_ADMIN_EMAIL &&
    password === process.env.SECOND_ADMIN_PASSWORD &&
    secretKey === process.env.ADMIN_SECRET_KEY;

  if (isFirstAdmin || isSecondAdmin) {
    const token = jwt.sign(
      {
        role: "admin",
        email,
        id: process.env.ADMIN_ID,
        name: "Admin",
        profilePhoto: "",
      },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } else {
    res.status(403).json({ message: "Invalid admin credentials" });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -__v");
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

exports.getAllGovernments = async (req, res) => {
  try {
    const governments = await Government.find({}, "-__v");
    res.json({ governments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch governments" });
  }
};

exports.deleteGovernment = async (req, res) => {
  const governmentId = req.params.id;

  try {
    const government = await Government.findById(governmentId);
    if (!government) {
      return res.status(404).json({ message: "Government not found" });
    }
    await Government.findByIdAndDelete(governmentId);
    res.json({ message: "Government deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete government" });
  }
};

exports.verifyGovernment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params.id);

    const government = await Government.findById(id);
    if (!government) {
      return res.status(404).json({ message: "Government official not found" });
    }

    if (government.isVerified) {
      return res.status(400).json({ message: "Government official is already verified" });
    }

    government.isVerified = true;
    await government.save();

    res.status(200).json({
      message: "Government official verified successfully",
      government
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const Government = require("../models/Government");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const imagekit = require("../utils/imagekit");
const streamifier = require("streamifier");
const Post = require("../models/Post");

exports.registerGov = async (req, res) => {
  try {
    const { department, email, password, phone, city } = req.body;
    const file = req.file;

    if (!file)
      return res.status(400).json({ message: "Proof document is required" });

    // Check if user already exists
    const govExists = await Government.findOne({ officialEmail: email });
    if (govExists)
      return res.status(400).json({ message: "Already registered" });

    // Upload file to ImageKit
    const uploadResponse = await new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: streamifier.createReadStream(file.buffer),
          fileName: `gov-proof-${Date.now()}`,
          folder: "/citipulse/gov-proofs",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    const proofDocumentUrl = uploadResponse.url;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    const gov = await Government.create({
      authorityName: department,
      officialEmail: email,
      passwordHash: hashedPassword,
      phone,
      city,
      proofDocumentUrl,
    });

    // Generate token
    const token = jwt.sign(
      {
        id: gov._id,
        role: "government",
        email: gov.officialEmail,
        name: gov.authorityName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res
      .status(201)
      .json({ token, message: "Government registered successfully" });
  } catch (err) {
    console.error("RegisterGov Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.loginGov = async (req, res) => {
  try {
    const { officialEmail, password } = req.body;

    const gov = await Government.findOne({ officialEmail });
    if (!gov) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, gov.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: gov._id,
        role: "government",
        email: gov.officialEmail,
        name: gov.authorityName,
        profilePhoto: gov.profilePhoto,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ token, message: "Login successful" });
  } catch (err) {
    console.error("LoginGov Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// controllers/governmentController.js
exports.profileGov = async (req, res) => {
  try {
    const id = req.params.userId;
    if (!id)
      return res.status(401).json({ message: "Unauthorized: govId missing" });

    const gov = await Government.findById(id);
    if (!gov) return res.status(404).json({ message: "Government not found" });

    res.status(200).json({
      authorityName: gov.authorityName,
      officialEmail: gov.officialEmail,
      phone: gov.phone,
      alternateContact: gov.alternateContact,
      designation: gov.designation,
      department: gov.department,
      jurisdictionArea: gov.jurisdictionArea,
      officeAddress: gov.officeAddress,
      city: gov.city,
      state: gov.state,
      pincode: gov.pincode,
      profilePhoto: gov.profilePhoto,
      bio: gov.bio,
      socialLinks: gov.socialLinks,
      website: gov.website,
      proofDocumentUrl: gov.proofDocumentUrl,
      idProofType: gov.idProofType,
      idProofNumber: gov.idProofNumber,
      isVerified: gov.isVerified,
      resolvedIssuesCount: gov.resolvedIssuesCount,
      role: gov.role,
      createdAt: gov.createdAt,
      updatedAt: gov.updatedAt,
    });
  } catch (err) {
    console.error("Get government profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfileGov = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("Updating government profile for ID:", req.body);
    if (!id)
      return res.status(401).json({ message: "Unauthorized: govId missing" });

    const updates = req.body;

    // Handle profile photo upload
    if (req.file) {
      const uploadResponse = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: streamifier.createReadStream(req.file.buffer),
            fileName: `gov-profile-${Date.now()}`,
            folder: "/citiPulse/gov-profiles",
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      updates.profilePhoto = uploadResponse.url;
    }

    const updatedGov = await Government.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      updatedGov,
    });
  } catch (err) {
    console.error("Update government profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.allPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name profilePhoto")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching resolved posts:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching resolved posts." });
  }
};

exports.progressState = async (req, res) => {
  try {
    const postId = req.params.id;
    const { id, role } = req.user;
    console.log("ye bhi hai", id, role);

    const progressOrder = [
      "Unseen",
      "Problem Seen",
      "Verified",
      "Work Started",
      "Work Near Completion",
      "Finished",
    ];

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const currentIndex = progressOrder.indexOf(post.progressState);
    if (currentIndex === -1 || currentIndex === progressOrder.length - 1) {
      return res
        .status(400)
        .json({ message: "Cannot advance progress further." });
    }

    const nextState = progressOrder[currentIndex + 1];
    post.progressState = nextState;

    if (nextState === "Problem Seen" && role === "government") {
      post.assignedGovernment = id;
    }

    if (nextState === "Waiting for User Verification") {
      const { finalCaption, finalImages } = req.body;

      if (!finalCaption || !finalImages || !Array.isArray(finalImages)) {
        return res
          .status(400)
          .json({ message: "Final caption and images are required." });
      }

      post.finalUpdate = {
        caption: finalCaption,
        images: finalImages, // array of { url, public_id }
      };
    }

    await post.save();

    res.status(200).json({
      message: `Progress advanced to "${nextState}"`,
      post,
    });
  } catch (error) {
    console.error("Error advancing progress state:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.regressProgressState = async (req, res) => {
  try {
    const postId = req.params.id;

    const progressOrder = [
      "Unseen",
      "Problem Seen",
      "Verified",
      "Work Started",
      "Work Near Completion",
      "Finished",
    ];

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const currentIndex = progressOrder.indexOf(post.progressState);

    // If state is Work Near Completion or Finished, do not allow going backward
    if (post.progressState === "Finished") {
      return res
        .status(400)
        .json({ message: 'Cannot go backward from "Finished".' });
    }

    if (currentIndex <= 0) {
      return res
        .status(400)
        .json({ message: "Already at the earliest progress state." });
    }

    const previousState = progressOrder[currentIndex - 1];
    post.progressState = previousState;

    await post.save();

    res.status(200).json({
      message: `Progress regressed to "${previousState}"`,
      post,
    });
  } catch (error) {
    console.error("Error regressing progress state:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFinalWork = async (req, res) => {
  try {
    const postId = req.params.id;
    const { finalCaption } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images are required." });
    }

    // Upload images to ImageKit
    const finalImages = [];

    for (const file of req.files) {
      const uploaded = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: streamifier.createReadStream(file.buffer),
            fileName: `final-work-${Date.now()}`,
            folder: "/citiPulse/final-updates",
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      finalImages.push({
        url: uploaded.url,
        public_id: uploaded.fileId,
      });
    }

    post.finalUpdate = {
      caption: finalCaption || "",
      images: finalImages,
    };

    post.progressState = "Waiting for User Verification";

    await post.save();

    return res.status(200).json({
      message: "Final update added. Waiting for user verification.",
      post,
    });
  } catch (err) {
    console.error("Error in updateFinalWork:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const Post = require("../models/Post.js");
const imagekit = require("../utils/imagekit");
const streamifier = require("streamifier");
const User = require("../models/User");
const Government = require("../models/Government");
const { populateComments } = require("../utils/populateComments");

exports.createPost = async (req, res) => {
  try {
    const { caption, priority, location } = req.body;
    const userId = req.user.id;
    const images = [];

    // Parse location from stringified JSON
    const parsedLocation = JSON.parse(location);

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await new Promise((resolve, reject) => {
          imagekit.upload(
            {
              file: streamifier.createReadStream(file.buffer),
              fileName: `post-image-${Date.now()}`,
              folder: "/citiPulse/posts",
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        });

        images.push({
          url: uploadedImage.url,
          public_id: uploadedImage.fileId,
        });
      }
    }

    if (!caption && images.length === 0) {
      return res
        .status(400)
        .json({ message: "Post must have at least a caption or an image." });
    }

    const newPost = new Post({
      user: userId,
      caption,
      images,
      location: {
        country: "India",
        state: parsedLocation.state,
        landmark: parsedLocation.landmark,
        address: parsedLocation.address,
        pincode: parsedLocation.pincode,
        coordinates: parsedLocation.coordinates || null,
      },
      priority,
      currentState: "In Progress",
      progressState: "Unseen",
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully.",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error while creating post." });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email profilePhoto role") // adjust fields as needed
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error while fetching posts." });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.user.toString() !== userId)
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this post." });

    const updates = req.body;

    // Optional: Handle new images
    const newImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await new Promise((resolve, reject) => {
          imagekit.upload(
            {
              file: streamifier.createReadStream(file.buffer),
              fileName: `updated-post-img-${Date.now()}`,
              folder: "/citiPulse/posts",
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        });
        newImages.push({
          url: uploadedImage.url,
          public_id: uploadedImage.fileId,
        });
      }
      updates.images = newImages;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error while updating post." });
  }
};

// Delete post (only by owner)
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.user.toString() !== userId)
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error while deleting post." });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    console.log(postId, content);

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    let userInfo;
    const { id, role } = req.user;
    console.log("ye bhi hai", id, role);

    if (role === "user") {
      userInfo = await User.findById(id);
    } else if (role === "government") {
      userInfo = await Government.findById(id);
      console.log("ye bhi hai info", userInfo);
    } else if (role === "admin") {
      userInfo = { _id: id, name: "Admin" }; // use static name
    }

    if (!userInfo) {
      return res.status(404).json({ message: "User info not found" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      userId: id,
      userName:
        role === "user"
          ? userInfo.name
          : role === "government"
          ? userInfo.authorityName
          : "Admin",
      userRole: role,
      content,
    };

    post.comments.push(newComment);
    await post.save();
    const savedComment = post.comments[post.comments.length - 1]; // last added

    res
      .status(200)
      .json({ message: "Comment added successfully", comment: savedComment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addReply = async (req, res) => {
  try {
    console.log("yhi hai", req.body);
    const { postId, commentId, content } = req.body;
    const { id, role } = req.user;
    console.log(commentId);

    let userInfo;
    if (role === "user") {
      userInfo = await User.findById(id);
    } else if (role === "government") {
      userInfo = await Government.findById(id);
    } else if (role === "admin") {
      userInfo = { _id: id, name: "Admin" };
    }

    if (!userInfo) {
      return res.status(404).json({ message: "User info not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = {
      userId: id,
      userName:
        role === "user"
          ? userInfo.name
          : role === "government"
          ? userInfo.authorityName
          : "Admin",
      userRole: role,
      content,
    };

    comment.replies.push(reply);
    await post.save();
    const savedReply = comment.replies[comment.replies.length - 1];

    res
      .status(200)
      .json({ message: "Reply added successfully", reply: savedReply });
  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteComment = async (req, res) => {
  const { postId, commentIndex } = req.body;
  const { id, role } = req.user;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments[commentIndex];
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Allow: author or admin
    const isAuthor = comment.userId?.toString() === id;
    const isAdmin = role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteReply = async (req, res) => {
  const { postId, commentIndex, replyIndex } = req.body;
  const { id, role } = req.user;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments[commentIndex];
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies[replyIndex];
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const isAuthor = reply.userId?.toString() === id;
    const isAdmin = role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.replies.splice(replyIndex, 1);
    await post.save();

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (err) {
    console.error("Error deleting reply:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.votePost = async (req, res) => {
  const { postId, type } = req.body;
  const userId = req.user.id;

  if (!["upvote", "downvote"].includes(type)) {
    return res.status(400).json({ message: "Invalid vote type." });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const hasUpvoted = post.upvotes.includes(userId);
    const hasDownvoted = post.downvotes.includes(userId);

    if (type === "upvote") {
      if (hasUpvoted) {
        post.upvotes.pull(userId); // remove upvote (toggle off)
      } else {
        post.upvotes.push(userId);
        if (hasDownvoted) post.downvotes.pull(userId); // remove downvote if exists
      }
    }

    if (type === "downvote") {
      if (hasDownvoted) {
        post.downvotes.pull(userId); // remove downvote (toggle off)
      } else {
        post.downvotes.push(userId);
        if (hasUpvoted) post.upvotes.pull(userId); // remove upvote if exists
      }
    }

    await post.save();

    res.status(200).json({
      message: `Vote recorded as "${type}"`,
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
      userVote: type,
    });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(req.params.postId);

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log("post hai", post);

    res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Error fetching post details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

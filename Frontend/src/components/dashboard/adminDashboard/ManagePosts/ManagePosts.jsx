import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Trash2, Filter, X } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import { Link } from "react-router-dom";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const { id, role, name } = useAuth();

  // Filter states
  const [filters, setFilters] = useState({
    minUpvotes: "",
    maxUpvotes: "",
    minDownvotes: "",
    maxDownvotes: "",
    priority: "",
    sortBy: "newest", // newest, oldest, upvotes, downvotes
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [posts, filters]);

  const applyFilters = () => {
    let filtered = [...posts];

    // Filter by upvotes
    if (filters.minUpvotes !== "") {
      filtered = filtered.filter(
        (post) => post.upvotes.length >= parseInt(filters.minUpvotes)
      );
    }
    if (filters.maxUpvotes !== "") {
      filtered = filtered.filter(
        (post) => post.upvotes.length <= parseInt(filters.maxUpvotes)
      );
    }

    // Filter by downvotes
    if (filters.minDownvotes !== "") {
      filtered = filtered.filter(
        (post) => post.downvotes.length >= parseInt(filters.minDownvotes)
      );
    }
    if (filters.maxDownvotes !== "") {
      filtered = filtered.filter(
        (post) => post.downvotes.length <= parseInt(filters.maxDownvotes)
      );
    }

    // Filter by priority
    if (filters.priority !== "") {
      filtered = filtered.filter((post) => post.priority === filters.priority);
    }

    // Sort posts
    switch (filters.sortBy) {
      case "upvotes":
        filtered.sort((a, b) => b.upvotes.length - a.upvotes.length);
        break;
      case "downvotes":
        filtered.sort((a, b) => b.downvotes.length - a.downvotes.length);
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredPosts(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minUpvotes: "",
      maxUpvotes: "",
      minDownvotes: "",
      maxDownvotes: "",
      priority: "",
      sortBy: "newest",
    });
  };

  const toggleComments = (postId) => {
    setCommentsVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentChange = (e, postId) => {
    setCommentInputs({ ...commentInputs, [postId]: e.target.value });
  };

  const handleReplyChange = (e, commentId) => {
    setReplyInputs({ ...replyInputs, [commentId]: e.target.value });
  };

  const submitComment = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/addComment`,
        { postId, content: commentInputs[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setCommentInputs({ ...commentInputs, [postId]: "" });
      fetchAllPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  const submitReply = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/addReply`,
        { postId, commentId, content: replyInputs[commentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setReplyInputs({ ...replyInputs, [commentId]: "" });
      fetchAllPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add reply");
    }
  };

  const deleteComment = async (postId, commentIndex) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/deleteComment`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId, commentIndex },
        }
      );
      toast.success(res.data.message);
      fetchAllPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    }
  };

  const deleteReply = async (postId, commentIndex, replyIndex) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/deleteReply`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId, commentIndex, replyIndex },
        }
      );
      toast.success(res.data.message);
      fetchAllPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete reply");
    }
  };

  const fetchAllPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/admin/allPosts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch posts");
    }
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/admin/deletePosts/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-6xl mx-auto px-4 py-6 text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Manage All Posts</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
              >
                <X size={16} />
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Upvotes Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upvotes Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={filters.minUpvotes}
                    onChange={(e) =>
                      handleFilterChange("minUpvotes", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    value={filters.maxUpvotes}
                    onChange={(e) =>
                      handleFilterChange("maxUpvotes", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Downvotes Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Downvotes Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={filters.minDownvotes}
                    onChange={(e) =>
                      handleFilterChange("minDownvotes", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    value={filters.maxDownvotes}
                    onChange={(e) =>
                      handleFilterChange("maxDownvotes", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="upvotes">Most Upvotes</option>
                  <option value="downvotes">Most Downvotes</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredPosts.length} of {posts.length} posts
            </div>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {posts.length === 0
                ? "No posts available."
                : "No posts match the current filters."}
            </p>
            {posts.length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-8"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {post.caption || "No Caption"}
                </h3>
                <button
                  onClick={() => deletePost(post._id)}
                  className="text-red-600 hover:text-red-700 p-2 rounded"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {post.images?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`post-${idx}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>User:</strong>{" "}
                  <Link
                    to={`/user/${post.user?._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {post.user?.name
                      ? `${post.user.name} (${post.user.email})`
                      : post.user?._id || "Unknown"}
                  </Link>
                </p>
                <p>
                  <strong>Country:</strong> India
                </p>
                <p>
                  <strong>State:</strong>{" "}
                  {post.location?.state || "Not Provided"}
                </p>
                <p>
                  <strong>Landmark:</strong>{" "}
                  {post.location?.landmark || "Not Provided"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {post.location?.address || "Not Provided"}
                </p>
                <p>
                  <strong>Pincode:</strong>{" "}
                  {post.location?.pincode || "Not Provided"}
                </p>
                <p>
                  <strong>Priority:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      post.priority === "urgent"
                        ? "bg-red-100 text-red-800"
                        : post.priority === "high"
                        ? "bg-orange-100 text-orange-800"
                        : post.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {post.priority}
                  </span>
                </p>
                <p>
                  <strong>Upvotes:</strong>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {post.upvotes.length}
                  </span>
                </p>
                <p>
                  <strong>Downvotes:</strong>
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {post.downvotes.length}
                  </span>
                </p>
                <p>
                  <strong>Status:</strong> {post.currentState}
                </p>
                <p>
                  <strong>Progress State:</strong> {post.progressState}
                </p>
              </div>

              {/* Toggle Comments */}
              <button
                onClick={() => toggleComments(post._id)}
                className="mt-5 text-sm text-blue-600 hover:underline"
              >
                {commentsVisible[post._id] ? "Hide Comments" : "View Comments"}
              </button>

              {/* Comments */}
              {commentsVisible[post._id] && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-3 text-gray-800">
                    Comments
                  </h4>
                  {post.comments.map((comment, cIdx) => (
                    <div key={comment._id} className="mb-4">
                      <p className="text-sm text-gray-700">
                        <strong>{comment.userName || "User"}:</strong>{" "}
                        {comment.content}
                      </p>
                      {(comment.userId === id || role === "admin") && (
                        <button
                          onClick={() => deleteComment(post._id, cIdx)}
                          className="text-xs text-red-500 hover:underline mt-1 ml-2"
                        >
                          Delete Comment
                        </button>
                      )}
                      {comment.replies.map((reply, rIdx) => (
                        <div
                          key={reply._id}
                          className="ml-6 mt-2 text-sm text-gray-600"
                        >
                          ↳ <strong>{reply.userName || "User"}:</strong>{" "}
                          {reply.content}
                          {(reply.userId === id || role === "admin") && (
                            <button
                              onClick={() => deleteReply(post._id, cIdx, rIdx)}
                              className="text-xs text-red-500 hover:underline ml-2"
                            >
                              Delete Reply
                            </button>
                          )}
                        </div>
                      ))}

                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyInputs[comment._id] || ""}
                        onChange={(e) => handleReplyChange(e, comment._id)}
                        className="mt-2 w-full px-3 py-2 text-sm border rounded-md bg-gray-50 text-gray-800"
                      />
                      <button
                        onClick={() => submitReply(post._id, comment._id)}
                        className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Reply
                      </button>
                    </div>
                  ))}

                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post._id] || ""}
                    onChange={(e) => handleCommentChange(e, post._id)}
                    className="mt-3 w-full px-3 py-2 text-sm border rounded-md bg-gray-50 text-gray-800"
                  />
                  <button
                    onClick={() => submitComment(post._id)}
                    className="mt-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ManagePosts;

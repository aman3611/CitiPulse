import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Pencil, Trash2, X, Filter } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import LocationMap from "../../../Map/LocationMap";
import { ThumbsDown, ThumbsUp } from "lucide-react";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null); // For editing
  const { id, role, name } = useAuth();
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [openComments, setOpenComments] = useState({});
  const hasUpvoted = (post) => post.upvotes?.includes(id);
const hasDownvoted = (post) => post.downvotes?.includes(id);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "newest", // newest, oldest, upvotes, downvotes
    priority: "all", // all, Critical, High, Medium, Low
    minUpvotes: "",
    minDownvotes: "",
  });

  const handleCommentChange = (e, postId) => {
    setCommentInputs({ ...commentInputs, [postId]: e.target.value });
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleReplyChange = (e, postId, commentIndex) => {
    setReplyInputs({
      ...replyInputs,
      [`${postId}-${commentIndex}`]: e.target.value,
    });
  };

  const submitComment = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/addComment`,
        {
          postId,
          content: commentInputs[postId],
          userId: id,
          userName: name,
          userRole: role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      setCommentInputs({ ...commentInputs, [postId]: "" });
      fetchUserPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  const submitReply = async (postId, commentId, key) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/addReply`,
        {
          postId,
          commentId,
          content: replyInputs[key],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      setReplyInputs({ ...replyInputs, [key]: "" });
      fetchUserPosts();
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
      fetchUserPosts();
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
      fetchUserPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete reply");
    }
  };

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/allPosts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch your posts");
    }
  };

  const verifyPostCompletion = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/user/verifyPost/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);

      // Update post state locally
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                progressState: "Finished",
                currentState: "Resolved",
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify completion");
    }
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/user/deletePosts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  const vote = async (postId, type) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/votePost`,
        { postId, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      fetchUserPosts(); // refresh updated vote count
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit vote");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setEditPost((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setEditPost((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/editPosts/${
          editPost._id
        }`,
        editPost,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Post updated");
      setEditPost(null);
      fetchUserPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post");
    }
  };

  // Filter and sort posts
  const getFilteredAndSortedPosts = () => {
    let filteredPosts = posts.filter((post) => post.user?._id === id);

    // Apply priority filter
    if (filters.priority !== "all") {
      filteredPosts = filteredPosts.filter(
        (post) => post.priority === filters.priority
      );
    }

    // Apply minimum upvotes filter
    if (filters.minUpvotes !== "") {
      const minUpvotes = parseInt(filters.minUpvotes) || 0;
      filteredPosts = filteredPosts.filter(
        (post) => (post.upvotes?.length || 0) >= minUpvotes
      );
    }

    // Apply minimum downvotes filter
    if (filters.minDownvotes !== "") {
      const minDownvotes = parseInt(filters.minDownvotes) || 0;
      filteredPosts = filteredPosts.filter(
        (post) => (post.downvotes?.length || 0) >= minDownvotes
      );
    }

    // Apply sorting
    filteredPosts.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "upvotes":
          return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
        case "downvotes":
          return (b.downvotes?.length || 0) - (a.downvotes?.length || 0);
        default:
          return 0;
      }
    });

    return filteredPosts;
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: "newest",
      priority: "all",
      minUpvotes: "",
      minDownvotes: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserPosts();
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = getFilteredAndSortedPosts();

  return (
    <>
      <Toaster />
      {!editPost &&
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Posts</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Filter & Sort Posts
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="upvotes">Most Upvotes</option>
                  <option value="downvotes">Most Downvotes</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Minimum Upvotes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Upvotes
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.minUpvotes}
                  onChange={(e) =>
                    handleFilterChange("minUpvotes", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              {/* Minimum Downvotes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Downvotes
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.minDownvotes}
                  onChange={(e) =>
                    handleFilterChange("minDownvotes", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredPosts.length} of{" "}
              {posts.filter((post) => post.user?._id === id).length} posts
            </div>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {posts.filter((post) => post.user?._id === id).length === 0
                ? "You haven't created any posts yet."
                : "No posts match your current filters."}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {post.caption || "No Caption"}
                    {new Date(post.updatedAt).getTime() !==
                      new Date(post.createdAt).getTime() && (
                      <span className="ml-2 text-sm text-yellow-500 italic">
                        (Edited)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => deletePost(post._id)}
                    className="text-red-500 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setEditPost(post)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              </div>

              {post.images?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`post-img-${idx}`}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <p>
                  <strong>Country:</strong> India
                </p>
                <p>
                  <strong>State:</strong> {post.location?.state || "N/A"}
                </p>
                <p>
                  <strong>Landmark:</strong> {post.location?.landmark || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {post.location?.address || "N/A"}
                </p>
                <p>
                  <strong>Pincode:</strong> {post.location?.pincode || "N/A"}
                </p>
                <p>
                  <strong>Priority:</strong>
                  <span
                    className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                      post.priority === "Critical"
                        ? "bg-red-100 text-red-800"
                        : post.priority === "High"
                        ? "bg-orange-100 text-orange-800"
                        : post.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {post.priority}
                  </span>
                </p>
                <p>
                  <strong>Status:</strong> {post.currentState}
                </p>
                <p>
                  <strong>Progress:</strong> {post.progressState}
                </p>
              </div>

              {post.location?.coordinates?.lat &&
                post.location?.coordinates?.lng && (
                  <div className="col-span-2 mt-4">
                    <LocationMap
                      lat={post.location.coordinates.lat}
                      lng={post.location.coordinates.lng}
                    />
                  </div>
                )}

             <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
               <button
  onClick={() => vote(post._id, "upvote")}
  className={`flex items-center gap-2 font-medium px-3 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
    hasUpvoted(post)
      ? "bg-green-500 text-white shadow-lg"
      : "bg-gray-100 text-green-500 hover:bg-green-50 border border-greem-200"
  }`}
>
  <ThumbsUp 
    size={16} 
    className={hasUpvoted(post) ? "fill-current" : ""} 
  />
  Upvote ({post.upvotes?.length || 0})
</button>

               <button
  onClick={() => vote(post._id, "downvote")}
  className={`flex items-center gap-2 font-medium px-3 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
    hasDownvoted(post)
      ? "bg-red-600 text-white shadow-lg"
      : "bg-gray-100 text-red-600 hover:bg-red-50 border border-red-300"
  }`}
>
  <ThumbsDown 
    size={16} 
    className={hasDownvoted(post) ? "fill-current" : ""} 
  />
  Downvote ({post.downvotes?.length || 0})
</button>

              </div>

              {post.finalUpdate && (
                <div className="mt-5">
                  <h4 className="text-base font-semibold text-blue-600 mb-2">
                    Final Update
                  </h4>
                  {post.finalUpdate.caption && (
                    <p className="text-gray-700 mb-2">
                      <strong>Caption:</strong> {post.finalUpdate.caption}
                    </p>
                  )}
                  {post.finalUpdate.images?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {post.finalUpdate?.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={`final-img-${idx}`}
                          className="w-full h-48 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No final images submitted.</p>
                  )}
                </div>
              )}

              {post.progressState === "Waiting for User Verification" && (
                <button
                  onClick={() => verifyPostCompletion(post._id)}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Verify Completion
                </button>
              )}

              {/* Comments Toggle */}
              <div className="mt-6">
                <button
                  onClick={() => toggleComments(post._id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openComments[post._id] ? "Hide Comments" : "View Comments"}
                </button>

                {openComments[post._id] && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Comments
                    </h4>

                    {post.comments?.slice(0, 3).map((comment, cIdx) => (
                      <div
                        key={cIdx}
                        className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3"
                      >
                        <p className="text-gray-800">
                          <strong>{comment.userName || "User"}:</strong>{" "}
                          {comment.content}
                        </p>

                        {comment.userId === id && (
                          <button
                            onClick={() => deleteComment(post._id, cIdx)}
                            className="text-red-500 text-sm mt-1"
                          >
                            Delete Comment
                          </button>
                        )}

                        {comment.replies.map((reply, rIdx) => (
                          <div
                            key={rIdx}
                            className="ml-4 mt-2 border-l-2 border-blue-300 pl-3 text-sm text-gray-700"
                          >
                            ↳ <strong>{reply.userName || "User"}:</strong>{" "}
                            {reply.content}
                            {reply.userId === id && (
                              <button
                                onClick={() =>
                                  deleteReply(post._id, cIdx, rIdx)
                                }
                                className="text-red-500 text-xs ml-2"
                              >
                                Delete Reply
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Reply Input */}
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyInputs[`${post._id}-${cIdx}`] || ""}
                            onChange={(e) =>
                              handleReplyChange(e, post._id, cIdx)
                            }
                            className="w-full p-2 rounded border border-gray-300 text-sm"
                          />
                          <button
                            onClick={() =>
                              submitReply(
                                post._id,
                                comment._id,
                                `${post._id}-${cIdx}`
                              )
                            }
                            className="mt-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Comment Input */}
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) => handleCommentChange(e, post._id)}
                      className="w-full p-2 mt-2 border rounded border-gray-300 text-sm"
                    />
                    <button
                      onClick={() => submitComment(post._id)}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>}

      {/* Edit Modal */}
    {/* Edit Modal */}
      {/* Edit Modal */}
      {editPost && (
    <div className="w-full  inset-0  bg-opacity-50 z-50 flex justify-center items-start px-4 py-8 overflow-y-auto ">
          <div className="bg-white max-w-2xl mx-auto w-full rounded-xl shadow-2xl relative my-auto">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-5 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Edit Post</h3>
                  <p className="text-sm text-gray-500 mt-1">Update your post information</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditPost(null)}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Caption Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Post Caption
                  </label>
                  <textarea
                    name="caption"
                    value={editPost.caption}
                    onChange={handleEditChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-white"
                    rows={4}
                    placeholder="Enter post caption..."
                  />
                </div>

                {/* Location Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Location Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        name="location.state"
                        value={editPost.location?.state || ""}
                        onChange={(e) =>
                          setEditPost((prev) => ({
                            ...prev,
                            location: { ...prev.location, state: e.target.value },
                          }))
                        }
                        placeholder="Enter state"
                        className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Landmark
                      </label>
                      <input
                        name="location.landmark"
                        value={editPost.location?.landmark || ""}
                        onChange={(e) =>
                          setEditPost((prev) => ({
                            ...prev,
                            location: { ...prev.location, landmark: e.target.value },
                          }))
                        }
                        placeholder="Enter landmark"
                        className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        name="location.address"
                        value={editPost.location?.address || ""}
                        onChange={(e) =>
                          setEditPost((prev) => ({
                            ...prev,
                            location: { ...prev.location, address: e.target.value },
                          }))
                        }
                        placeholder="Enter full address"
                        className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        name="location.pincode"
                        value={editPost.location?.pincode || ""}
                        onChange={(e) =>
                          setEditPost((prev) => ({
                            ...prev,
                            location: { ...prev.location, pincode: e.target.value },
                          }))
                        }
                        placeholder="Enter pincode"
                        className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={editPost.priority}
                        onChange={handleEditChange}
                        className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      >
                        <option value="Low">🟢 Low Priority</option>
                        <option value="Medium">🟡 Medium Priority</option>
                        <option value="High">🟠 High Priority</option>
                        <option value="Critical">🔴 Critical Priority</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditPost(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleEditSubmit}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPosts;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../../Context/AuthContext";
import {
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import LocationMap from "../../../Map/LocationMap";
import { Link } from "react-router-dom";
import { Share2, Send, Share } from 'lucide-react';
import { Loader2 } from "lucide-react";


const UpvotedIssue = () => {
  const [loading, setLoading] = useState(true);
   const [posts, setPosts] = useState([]);
    const [commentInputs, setCommentInputs] = useState({});
    const [replyInputs, setReplyInputs] = useState({});
    const [openComments, setOpenComments] = useState({});
    const { id, name, role } = useAuth();
    const hasUpvoted = (post) => post.upvotes?.includes(id);
const hasDownvoted = (post) => post.downvotes?.includes(id);


  const fetchUpvotedPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/upvotedPosts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.upvotedPosts);
      setPosts(res.data.upvotedPosts);
    } catch (error) {
      toast.error("Failed to load downvoted posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

   const handleShare = async (postId) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const shareData = {
      title: "Check out this CitiPulse post!",
      text: "A civic issue shared on CitiPulse. Help raise awareness!",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Sharing failed:", err);
      toast.error("Unable to share or copy link");
    }
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentChange = (e, postId) => {
    setCommentInputs({ ...commentInputs, [postId]: e.target.value });
  };

  const handleReplyChange = (e, postId, commentId) => {
    setReplyInputs({
      ...replyInputs,
      [`${postId}-${commentId}`]: e.target.value,
    });
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
      fetchUpvotedPosts(); // refresh updated vote count
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit vote");
    }
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      setCommentInputs({ ...commentInputs, [postId]: "" });
      fetchUpvotedPosts();
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      setReplyInputs({ ...replyInputs, [key]: "" });
      fetchUpvotedPosts();
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
      fetchUpvotedPosts();
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
      fetchUpvotedPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete reply");
    }
  };

  useEffect(() => {
    fetchUpvotedPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-800">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-blue-600">
        Upvoted Issues
      </h2>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-lg">You haven't upvoted any posts yet.</p>
      ) : (
        <>
          {posts.map((post) => (
              <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8 w-full"
            >
              <div className="flex w-full justify-between items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {post.caption || "No Caption"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <button
  onClick={() => handleShare(post._id)}
  className="bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all duration-200 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
  title="Share Post"
>
  <Send className="w-5 h-5" />
</button>
                </div>
              </div>

              {post.images?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`post-img-${idx}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <p>
                  <strong>Posted by:</strong>{" "}
                  <Link
                    to={`/user/profile/${post.user?.role}/${post.user?._id}`}
                  >
                    <span className="text-blue-600 hover:underline">
                      {post.user?.name || "Unknown"}
                    </span>
                  </Link>
                </p>
                <p>
                  <strong>Priority:</strong> {post.priority}
                </p>
                <p>
                  <strong>Status:</strong> {post.currentState}
                </p>
                <p>
                  <strong>Progress:</strong> {post.progressState}
                </p>
                <p className="col-span-2">
                  <strong>Location:</strong> {post.location?.address},{" "}
                  {post.location?.landmark}, {post.location?.state} -{" "}
                  {post.location?.pincode}
                </p>

                {post.location?.coordinates?.lat &&
                  post.location?.coordinates?.lng && (
                    <div className="col-span-2 mt-4">
                      <LocationMap
                        lat={post.location.coordinates.lat}
                        lng={post.location.coordinates.lng}
                      />
                    </div>
                  )}
              </div>

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

              <div className="mt-6">
                <button
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium mb-4"
                >
                  <MessageSquare size={18} />
                  {openComments[post._id] ? "Hide Comments" : "View Comments"}
                  {openComments[post._id] ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {openComments[post._id] && (
                  <div className="space-y-4">
                    {post.comments.slice(0, 3).map((comment, cIdx) => (
                      <div
                        key={cIdx}
                        className="border rounded-md p-3 bg-gray-50"
                      >
                        <p className="text-gray-800">
                          <strong>{comment.userName || "User"}:</strong>{" "}
                          {comment.content}
                        </p>
                        {comment.userId === id && (
                          <button
                            onClick={() => deleteComment(post._id, cIdx)}
                            className="text-red-500 text-xs mt-1"
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

                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={
                            replyInputs[`${post._id}-${comment._id}`] || ""
                          }
                          onChange={(e) =>
                            handleReplyChange(e, post._id, comment._id)
                          }
                          className="w-full p-2 mt-2 rounded border border-gray-300 text-sm"
                        />
                        <button
                          onClick={() =>
                            submitReply(
                              post._id,
                              comment._id,
                              `${post._id}-${comment._id}`
                            )
                          }
                          className="mt-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
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
                      className="w-full p-2 mt-2 rounded border border-gray-300 text-sm"
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

          ))}
</>
      )}
    </div>
  );
};

export default UpvotedIssue;

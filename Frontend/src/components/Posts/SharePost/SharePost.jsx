import React, { useEffect, useState } from "react";
import Header from "../../Layouts/Header/Header";
import Footer from "../../Layouts/Footer/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";

const SharePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id, name, role } = useAuth();
  const navigate = useNavigate();

  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [openComments, setOpenComments] = useState({});

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
      fetchPost(); // refresh updated vote count
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
      fetchPost();
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
      fetchPost();
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
      fetchPost();
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
      fetchPost();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete reply");
    }
  };

  const fetchPost = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/post/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPost(response.data.post);
      console.log(response.data.post);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view the post");
      return navigate("/login");
    }

    fetchPost();
  }, [postId]);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <div className="w-[90%] mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-4 text-center">Post</h1>
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
              <Link to={`/post/${post._id}`}>
                <button
                  className="bg-gray-100 hover:bg-gray-300 active:scale-95 transition-all duration-200 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                  title="Share Post"
                >
                  <Share2 className="w-5 h-5 text-black" />
                </button>
              </Link>
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
              <Link to={`/user/profile/${post.user?.role}/${post.user?._id}`}>
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
            <div className="flex items-center gap-6 mt-4">
              <button
                onClick={() => vote(post._id, "upvote")}
                className="flex items-center gap-1 text-green-600 hover:text-green-800"
              >
                👍 Upvote ({post.upvotes?.length || 0})
              </button>
              <button
                onClick={() => vote(post._id, "downvote")}
                className="flex items-center gap-1 text-red-600 hover:text-red-800"
              >
                👎 Downvote ({post.downvotes?.length || 0})
              </button>
            </div>
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
                  <div key={cIdx} className="border rounded-md p-3 bg-gray-50">
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
                            onClick={() => deleteReply(post._id, cIdx, rIdx)}
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
                      value={replyInputs[`${post._id}-${comment._id}`] || ""}
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
      </div>
      <Footer />
    </div>
  );
};

export default SharePost;

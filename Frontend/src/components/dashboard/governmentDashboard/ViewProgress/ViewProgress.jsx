import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../../Context/AuthContext";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import LiveRouteToIssue from "../../../Map/LiveRoutetoIssue";


const ViewProgress = () => {
  const [posts, setPosts] = useState([]);
  const [finalCaption, setFinalCaption] = useState("");
  const [finalImages, setFinalImages] = useState([]);
  const [uploadingPostId, setUploadingPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const { id } = useAuth();
  const hasUpvoted = (post) => post.upvotes?.includes(id);
const hasDownvoted = (post) => post.downvotes?.includes(id);


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/gov/allPosts`,
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

  const toggleComments = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setFinalImages(previews);
  };

  const advanceProgress = async (postId, currentProgress) => {
    try {
      const token = localStorage.getItem("token");
      const isFinal = currentProgress === "Work Near Completion";

      const payload = isFinal
        ? {
            finalCaption,
            finalImages: finalImages.map((img) => ({
              url: img.url,
              public_id: "mock",
            })),
          }
        : {};

      const res = await axios.put(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/gov/progressState/${postId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      setFinalCaption("");
      setFinalImages([]);
      setUploadingPostId(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to advance progress");
    }
  };

  const regressProgress = async (postId, currentProgress) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/gov/regressProgressState/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to go backward");
    }
  };

  const submitFinalUpdate = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("finalCaption", finalCaption);
      finalImages.forEach((img) => formData.append("images", img.file));

      const res = await axios.put(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/gov/updateFinalWork/${postId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);
      setFinalCaption("");
      setFinalImages([]);
      setUploadingPostId(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit final update");
    }
  };

  const handleCommentChange = (e, postId) => {
    setCommentInputs({ ...commentInputs, [postId]: e.target.value });
  };

  const handleReplyChange = (e, postId, cIdx) => {
    setReplyInputs({ ...replyInputs, [`${postId}-${cIdx}`]: e.target.value });
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
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  const submitReply = async (postId, commentId, cIdx) => {
    try {
      const token = localStorage.getItem("token");
      const key = `${postId}-${cIdx}`;
      const res = await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/addReply`,
        { postId, commentId, content: replyInputs[key] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setReplyInputs({ ...replyInputs, [key]: "" });
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add reply");
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
      fetchPosts(); // refresh updated vote count
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit vote");
    }
  };

  const deleteComment = async (postId, cIdx) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/deleteComment`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId, commentIndex: cIdx },
        }
      );
      toast.success(res.data.message);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    }
  };

  const deleteReply = async (postId, cIdx, rIdx) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/posts/deleteReply`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId, commentIndex: cIdx, replyIndex: rIdx },
        }
      );
      toast.success(res.data.message);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete reply");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">All Civic Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts
          .filter((post) => post.assignedGovernment === id && post.progressState !== "Finished")
          .map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {post.caption || "No Caption"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(post.createdAt).toLocaleString()}
              </p>

              {post.images?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt="post-img"
                      className="w-full h-48 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-700 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>
                  <strong>User:</strong> {post.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {post.user?.email}
                </p>
                <p>
                  <strong>State:</strong> {post.location?.state}
                </p>
                <p>
                  <strong>Landmark:</strong> {post.location?.landmark}
                </p>
                <p>
                  <strong>Address:</strong> {post.location?.address}
                </p>
                <p>
                  <strong>Pincode:</strong> {post.location?.pincode}
                </p>
                <p>
                  <strong>Status:</strong> {post.currentState}
                </p>
                <p>
                  <strong>Priority:</strong> {post.priority}
                </p>
                <p className="sm:col-span-2">
                  <strong>Progress:</strong>{" "}
                  <span className="text-yellow-600">{post.progressState}</span>
                </p>
              </div>

             <div className="flex flex-wrap items-center gap-6 mt-4 text-sm mb-4">
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

                 {post.location?.coordinates && (
                            <LiveRouteToIssue
                              issueLat={post.location.coordinates.lat}
                              issueLng={post.location.coordinates.lng}
                            />
                          )}

              {post.progressState === "Work Near Completion" &&
                uploadingPostId === post._id && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Final Caption"
                      value={finalCaption}
                      onChange={(e) => setFinalCaption(e.target.value)}
                      className="w-full border p-2 rounded-md"
                    />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      {finalImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt="preview"
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}

              <button
                onClick={() =>
                  post.progressState === "Work Near Completion" &&
                  uploadingPostId === post._id
                    ? submitFinalUpdate(post._id)
                    : post.progressState === "Work Near Completion"
                    ? setUploadingPostId(post._id)
                    : advanceProgress(post._id, post.progressState)
                }
                disabled={post.progressState === "Finished"}
                className={`mt-4 px-4 py-2 rounded text-white font-medium ${
                  post.progressState === "Finished" ||
                  post.progressState === "Waiting for User Verification"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {post.progressState === "Work Near Completion" &&
                uploadingPostId === post._id
                  ? "Submit Final Update"
                  : post.progressState === "Finished"
                  ? "Completed"
                  : "Advance Progress"}
              </button>

              <button
                onClick={() => regressProgress(post._id, post.progressState)}
                disabled={
                  post.progressState === "Finished" ||
                  post.progressState === "Unseen" ||
                  post.progressState === "Problem Seen"
                }
                className={`mt-2 ml-3 px-4 py-2 rounded text-white font-medium ${
                  post.progressState === "Finished" ||
                  post.progressState === "Unseen" ||
                  post.progressState === "Problem Seen" ||
                  post.progressState === "Waiting for User Verification"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Go Back
              </button>

              {/* Comment Section Toggle */}
              <div className="mt-6">
                <button
                  onClick={() => toggleComments(post._id)}
                  className="text-blue-600 font-medium mb-3"
                >
                  {visibleComments[post._id]
                    ? "Hide Comments"
                    : "View Comments"}
                </button>

                {visibleComments[post._id] && (
                  <>
                    {post.comments.map((comment, cIdx) => (
                      <div
                        key={cIdx}
                        className="bg-gray-50 border p-3 rounded-md mb-2"
                      >
                        <p className="text-sm">
                          <strong>{comment.userName}</strong>: {comment.content}
                        </p>
                        {comment.userId === id && (
                          <button
                            onClick={() => deleteComment(post._id, cIdx)}
                            className="text-red-500 text-xs"
                          >
                            Delete
                          </button>
                        )}

                        {/* Replies */}
                        {comment.replies.map((reply, rIdx) => (
                          <div
                            key={rIdx}
                            className="ml-4 text-sm text-gray-600 border-l pl-2 mt-1"
                          >
                            ↳ <strong>{reply.userName}</strong>: {reply.content}
                            {reply.userId === id && (
                              <button
                                onClick={() =>
                                  deleteReply(post._id, cIdx, rIdx)
                                }
                                className="text-red-500 text-xs ml-2"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Reply Input */}
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyInputs[`${post._id}-${cIdx}`] || ""}
                          onChange={(e) => handleReplyChange(e, post._id, cIdx)}
                          className="mt-2 p-1 w-full border rounded-md"
                        />
                        <button
                          onClick={() =>
                            submitReply(post._id, comment._id, cIdx)
                          }
                          className="text-sm bg-blue-500 text-white px-3 py-1 rounded mt-1"
                        >
                          Reply
                        </button>
                      </div>
                    ))}

                    {/* Comment Input */}
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) => handleCommentChange(e, post._id)}
                      className="w-full mt-2 p-2 border rounded-md"
                    />
                    <button
                      onClick={() => submitComment(post._id)}
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                      Comment
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default ViewProgress;

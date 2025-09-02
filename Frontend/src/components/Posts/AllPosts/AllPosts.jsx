// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, Toaster } from 'react-hot-toast';
// import { useAuth } from '../../Context/AuthContext';

// const AllPost = () => {
//   const [posts, setPosts] = useState([]);
//   const [commentInputs, setCommentInputs] = useState({});
//   const [replyInputs, setReplyInputs] = useState({});
//   const { id } = useAuth();

//   const fetchAllPosts = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/allPosts`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPosts(res.data.posts);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to load posts');
//     }
//   };

//   const handleCommentChange = (e, postId) => {
//     setCommentInputs({ ...commentInputs, [postId]: e.target.value });
//   };

//   const handleReplyChange = (e, postId, commentIndex) => {
//     setReplyInputs({
//       ...replyInputs,
//       [`${postId}-${commentIndex}`]: e.target.value,
//     });
//   };

//   const submitComment = async (postId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/addComment/${postId}`,
//         { content: commentInputs[postId] },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success(res.data.message);
//       setCommentInputs({ ...commentInputs, [postId]: '' });
//       fetchAllPosts();
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to add comment');
//     }
//   };

//   const submitReply = async (postId, commentIndex) => {
//     try {
//       const token = localStorage.getItem('token');
//       const key = `${postId}-${commentIndex}`;
//       const res = await axios.post(
//         `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/addReply/${postId}/${commentIndex}`,
//         { content: replyInputs[key] },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success(res.data.message);
//       setReplyInputs({ ...replyInputs, [key]: '' });
//       fetchAllPosts();
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to add reply');
//     }
//   };

//   const deleteComment = async (postId, commentIndex) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.delete(
//         `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/deleteComment/${postId}/${commentIndex}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success(res.data.message);
//       fetchAllPosts();
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to delete comment');
//     }
//   };

//   const deleteReply = async (postId, commentIndex, replyIndex) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.delete(
//         `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/DeleteReply/${postId}/${commentIndex}/${replyIndex}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success(res.data.message);
//       fetchAllPosts();
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to delete reply');
//     }
//   };

//   useEffect(() => {
//     fetchAllPosts();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto p-6 text-white">
//       <Toaster />
//       <h1 className="text-3xl font-bold text-cyan-400 mb-6">All Posts</h1>

//       {posts.length === 0 ? (
//         <p className="text-gray-400">No posts available.</p>
//       ) : (
//         posts.map((post) => (
//           <div key={post._id} className="bg-[#1a1a1a] p-4 rounded-xl shadow-md mb-6">
//             <h3 className="text-xl font-semibold mb-2">{post.caption || 'No Caption'}</h3>

//             {post.images?.length > 0 && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3">
//                 {post.images.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img.url}
//                     alt={`post-${idx}`}
//                     className="w-full rounded-lg object-cover max-h-60"
//                   />
//                 ))}
//               </div>
//             )}

//             <div className="text-sm text-gray-300 space-y-1 mb-4">
//               <p><strong>User:</strong> {post.user?.name || 'Unknown'}</p>
//               <p><strong>Priority:</strong> {post.priority}</p>
//               <p><strong>Status:</strong> {post.currentState}</p>
//               <p><strong>Progress:</strong> <span className="text-yellow-400">{post.progressState}</span></p>
//               <p><strong>Location:</strong> {post.location?.address}, {post.location?.landmark}, {post.location?.state} - {post.location?.pincode}</p>
//             </div>

//             <div className="mt-4">
//               <h4 className="text-lg font-semibold mb-2">Comments</h4>
//               {post.comments.map((comment, cIdx) => (
//                 <div key={cIdx} className="mb-2">
//                   <p><strong>{comment.user?.name || 'User'}:</strong> {comment.content}</p>
//                   {comment.user === id && (
//                     <button
//                       onClick={() => deleteComment(post._id, cIdx)}
//                       className="text-red-400 text-xs ml-2"
//                     >
//                       Delete Comment
//                     </button>
//                   )}

//                   {comment.replies.map((reply, rIdx) => (
//                     <div key={rIdx} className="ml-6 text-sm text-gray-400">
//                       ↳ <strong>{reply.user?.name || 'User'}:</strong> {reply.content}
//                       {reply.user === id && (
//                         <button
//                           onClick={() => deleteReply(post._id, cIdx, rIdx)}
//                           className="text-red-400 text-xs ml-2"
//                         >
//                           Delete Reply
//                         </button>
//                       )}
//                     </div>
//                   ))}

//                   <input
//                     type="text"
//                     placeholder="Write a reply..."
//                     value={replyInputs[`${post._id}-${cIdx}`] || ''}
//                     onChange={(e) => handleReplyChange(e, post._id, cIdx)}
//                     className="mt-1 p-1 rounded bg-gray-700 w-full text-white"
//                   />
//                   <button
//                     onClick={() => submitReply(post._id, cIdx)}
//                     className="text-sm bg-blue-600 mt-1 px-2 py-1 rounded"
//                   >
//                     Reply
//                   </button>
//                 </div>
//               ))}

//               <input
//                 type="text"
//                 placeholder="Write a comment..."
//                 value={commentInputs[post._id] || ''}
//                 onChange={(e) => handleCommentChange(e, post._id)}
//                 className="mt-2 p-2 rounded bg-gray-800 w-full text-white"
//               />
//               <button
//                 onClick={() => submitComment(post._id)}
//                 className="mt-1 bg-green-600 px-4 py-2 rounded"
//               >
//                 Comment
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AllPost;
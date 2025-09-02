const User = require('../models/User');
const Government = require('../models/Government');

async function populateCommentUsers(comments) {
  return Promise.all(comments.map(async (comment) => {
    let userData = await getUserData(comment.userId, comment.userRole);

    const populatedReplies = await Promise.all((comment.replies || []).map(async (reply) => {
      let replyUser = await getUserData(reply.userId, reply.userRole);
      return { ...reply.toObject(), user: replyUser };
    }));

    return { ...comment.toObject(), user: userData, replies: populatedReplies };
  }));
}

async function getUserData(userId, role) {
  if (role === 'user') {
    return await User.findById(userId).select('name email');
  } else if (role === 'government') {
    const gov = await Government.findById(userId).select('authorityName officialEmail');
    return gov ? { name: gov.authorityName, email: gov.officialEmail } : null;
  } else if (role === 'admin') {
    return { name: 'Admin', email: 'admin@citiPulse.hackathon' }; // You can adjust this
  }
}

module.exports = { populateCommentUsers };

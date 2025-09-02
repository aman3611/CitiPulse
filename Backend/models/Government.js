const mongoose = require("mongoose");

const governmentSchema = new mongoose.Schema({
  authorityName: { type: String, required: true },
  officialEmail: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  proofDocumentUrl: { type: String, required: true },
  designation: { type: String },
  department: { type: String },
  jurisdictionArea: { type: String },
  officeAddress: { type: String },
  phone: { type: String },
  alternateContact: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  profilePhoto: { type: String },
  bio: { type: String },
  socialLinks: {
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String },
  },
  website: { type: String },
  idProofType: { type: String },
  idProofNumber: { type: String },
  isVerified: { type: Boolean, default: false },
  resolvedIssuesCount: { type: Number, default: 0 },
  role: { type: String, enum: ["government"], default: "government" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Government", governmentSchema);

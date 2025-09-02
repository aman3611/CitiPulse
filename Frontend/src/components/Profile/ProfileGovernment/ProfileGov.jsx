import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  BadgeInfo,
  Building2,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  FileText,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
  User,
  ShieldCheck,
  Camera,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Header from "../../Layouts/Header/Header";
import Footer from "../../Layouts/Footer/Footer";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Responsive light gradient background
const GradientBG = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
    <div className="absolute h-80 w-80 left-1/4 top-0 bg-gradient-to-br from-blue-100/50 to-indigo-200/40 rounded-full blur-3xl animate-blob1" />
    <div className="absolute h-64 w-64 right-1/3 top-32 bg-gradient-to-tr from-purple-100/40 to-blue-200/30 rounded-full blur-3xl animate-blob2" />
    <div className="absolute h-56 w-56 left-2/3 top-2/3 bg-gradient-to-bl from-green-100/40 to-blue-200/30 rounded-full blur-3xl animate-blob3" />
    <div className="absolute h-60 w-60 right-1/4 bottom-0 bg-gradient-to-tl from-pink-100/30 to-purple-200/20 rounded-full blur-3xl animate-blob4" />
    <style>{`
      @keyframes blob1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(180deg)} }
      @keyframes blob2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(20px) rotate(-180deg)} }
      @keyframes blob3 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.1)} }
      @keyframes blob4 { 0%,100%{transform:translateX(0) rotate(0deg)} 50%{transform:translateX(10px) rotate(90deg)} }
      .animate-blob1 { animation: blob1 12s ease-in-out infinite; }
      .animate-blob2 { animation: blob2 15s ease-in-out infinite; }
      .animate-blob3 { animation: blob3 18s ease-in-out infinite; }
      .animate-blob4 { animation: blob4 20s ease-in-out infinite; }
    `}</style>
  </div>
);

// Floating particles for subtle animation
const FloatingParticles = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
        initial={{
          x:
            Math.random() *
            (typeof window !== "undefined" ? window.innerWidth : 1000),
          y:
            Math.random() *
            (typeof window !== "undefined" ? window.innerHeight : 800),
        }}
        animate={{
          y: [0, -60, 0],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: Math.random() * 2 + 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Divider with animation
const Divider = ({ delay = 0 }) => (
  <motion.div
    className="my-8 relative"
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 0.7, delay }}
  >
    <div className="border-t border-gray-200" />
    <motion.div
      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 w-2 h-2 rounded-full border border-blue-300"
      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.div>
);

// Stat card for quick stats
const StatCard = ({ icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "border-blue-200 hover:border-blue-300 bg-blue-50",
    green: "border-green-200 hover:border-green-300 bg-green-50",
    purple: "border-purple-200 hover:border-purple-300 bg-purple-50",
    orange: "border-orange-200 hover:border-orange-300 bg-orange-50",
  };
  return (
    <motion.div
      className={`${colorClasses[color]} border rounded-xl p-4 hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 bg-${color}-100 rounded-lg border border-${color}-200`}
        >
          {icon}
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-${color}-700 text-xl font-bold`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const socialIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

const ProfileGov = () => {
  const [gov, setGov] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [photoHover, setPhotoHover] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { userId } = useParams();
  const { id } = useAuth();
  const navigate = useNavigate();

  const fetchGovProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/gov/profile/government/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      setGov(res.data);
      setFormData(res.data);
      setPhotoPreview(res.data.profilePhoto || null);
    } catch (error) {
      setGov(null);
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view the post");
      return navigate("/login");
    }
    fetchGovProfile();
  }, []);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/user/profile/government/${userId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${formData?.name}'s Profile`,
          text: "Check out this user profile on CitiPulse!",
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share canceled or failed", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Profile link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      for (const key in formData) {
        if (key === "socialLinks") {
          form.append("socialLinks", JSON.stringify(formData[key]));
        } else {
          form.append(key, formData[key]);
        }
      }
      if (selectedPhoto) {
        form.append("profilePhoto", selectedPhoto);
      }
      await axios.put(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/gov/updateProfile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Profile updated successfully");
      setGov({ ...formData, profilePhoto: photoPreview });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const InfoRow = ({
    icon,
    label,
    name,
    value,
    inputType = "text",
    onChange,
    disabled,
    hint,
    multiline,
  }) => (
    <motion.div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 py-3 group relative overflow-hidden"
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      <div className="flex items-center gap-2 min-w-[180px] relative z-10">
        <motion.span
          className="text-blue-600 group-hover:text-blue-700 transition-colors duration-200"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {icon}
        </motion.span>
        <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}:
        </span>
      </div>
      <div className="flex-1 w-full relative z-10">
        {isEditing && name ? (
          multiline ? (
            <motion.textarea
              name={name}
              value={formData?.[name] ?? ""}
              onChange={onChange || handleChange}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              rows={3}
              whileFocus={{ scale: 1.01 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            />
          ) : (
            <motion.input
              name={name}
              value={formData?.[name] ?? ""}
              onChange={onChange || handleChange}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              whileFocus={{ scale: 1.01 }}
              type={inputType}
              disabled={disabled}
              placeholder={hint}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            />
          )
        ) : (
          <motion.span
            className="block text-gray-800 group-hover:text-blue-700 transition-colors max-w-xl"
            whileHover={{ x: 5 }}
          >
            {value || <em className="text-gray-500">Not Provided</em>}
          </motion.span>
        )}
      </div>
    </motion.div>
  );

  const getSocialLink = (key) =>
    (formData && formData.socialLinks && formData.socialLinks[key]) || "";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="text-blue-700 text-center mt-4 font-semibold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <motion.div
          className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-bold text-xl">
            Failed to load profile
          </p>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen py-8 font-sans selection:bg-blue-200 relative overflow-x-hidden">
        <GradientBG />
        <FloatingParticles />

        <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative shadow-xl rounded-3xl overflow-hidden backdrop-blur-sm bg-white/90 border border-gray-200"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pt-12 pb-8 px-4 sm:px-8 md:px-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5" />

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <motion.button
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition text-white rounded-full p-2 shadow-lg border border-white/30"
                  onClick={handleShare}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  title="Share Profile"
                >
                  <Share2 size={20} />
                </motion.button>
                <motion.button
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition text-white rounded-full p-2 shadow-lg border border-white/30"
                  onClick={() => setShowDetails(!showDetails)}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  title={showDetails ? "Hide Details" : "Show Details"}
                >
                  {showDetails ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
                {userId === id ? (
                  <motion.button
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition text-white rounded-full p-2 shadow-lg border border-white/30"
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    title={isEditing ? "Save Changes" : "Edit Profile"}
                  >
                    {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
                  </motion.button>
                ) : null}
              </div>

              {/* Profile Header */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
                {/* Profile Photo */}
                <motion.div
                  className="relative group"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
                  onMouseEnter={() => setPhotoHover(true)}
                  onMouseLeave={() => setPhotoHover(false)}
                >
                  <div className="relative">
                    <motion.img
                      src={
                        photoPreview ||
                        formData.profilePhoto ||
                        "/api/placeholder/200/200"
                      }
                      alt={formData.authorityName}
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white/70 shadow-2xl object-cover bg-gray-100"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <AnimatePresence>
                      {(photoHover || isEditing) && (
                        <motion.div
                          className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Camera className="text-white mb-2" size={28} />
                          {isEditing && (
                            <label className="cursor-pointer bg-blue-600/90 hover:bg-blue-700/90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors">
                              <Upload size={14} />
                              Change Photo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                              />
                            </label>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Verification Badge */}
                  <motion.div
                    className="absolute -bottom-2 -right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    {formData.isVerified ? (
                      <div className="bg-green-500 p-2 rounded-full shadow-lg border-4 border-white">
                        <ShieldCheck size={18} className="text-white" />
                      </div>
                    ) : (
                      <div className="bg-orange-500 p-2 rounded-full shadow-lg border-4 border-white">
                        <AlertCircle size={18} className="text-white" />
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left space-y-3">
                  <motion.h1
                    className="text-3xl sm:text-4xl font-bold text-white mb-1"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                  >
                    {formData.authorityName || "Government Official"}
                  </motion.h1>
                  <motion.div
                    className="flex flex-wrap justify-center lg:justify-start gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                        formData.isVerified
                          ? "bg-green-500/20 text-green-100 border-green-400/50"
                          : "bg-orange-500/20 text-orange-100 border-orange-400/50"
                      }`}
                    >
                      {formData.isVerified ? (
                        <>
                          <CheckCircle size={14} /> Verified Official
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} /> Pending Verification
                        </>
                      )}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                      <Award size={14} className="inline mr-1" />
                      {formData.resolvedIssuesCount || 0} Issues Resolved
                    </span>
                  </motion.div>
                  <motion.p
                    className="text-lg text-white/95 font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {formData.designation || "Government Position"}
                    {formData.department && (
                      <span className="text-white/80">
                        {" "}
                        | {formData.department}
                      </span>
                    )}
                  </motion.p>
                </div>
              </div>

              {/* Stats Cards */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <StatCard
                  icon={<TrendingUp className="text-green-600" size={20} />}
                  label="Success Rate"
                  value="94.2%"
                  color="green"
                />
                <StatCard
                  icon={<Users className="text-blue-600" size={20} />}
                  label="Citizens Served"
                  value="12.5K"
                  color="blue"
                />
                <StatCard
                  icon={<Clock className="text-purple-600" size={20} />}
                  label="Avg Response"
                  value="2.4 hrs"
                  color="purple"
                />
                <StatCard
                  icon={<Activity className="text-orange-600" size={20} />}
                  label="Active Cases"
                  value="23"
                  color="orange"
                />
              </motion.div>

              {/* View Details Button */}
              <motion.div
                className="flex justify-center mt-6 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-5 py-2 rounded-full shadow-lg border border-white/30 transition-all duration-300"
                  onClick={() => setShowDetails(!showDetails)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User size={16} />
                  {showDetails ? "Hide Details" : "View Full Profile"}
                  <motion.div
                    animate={{ rotate: showDetails ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sparkles size={14} />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>

            {/* Detailed Information Section */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  className="bg-white/95 backdrop-blur-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="p-5 sm:p-8 md:p-12">
                    {/* About Section */}
                    <motion.section
                      className="mb-10"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <FileText className="text-blue-600" size={20} />
                        About
                      </h3>
                      <AnimatePresence mode="wait">
                        {isEditing ? (
                          <motion.textarea
                            key="bio-edit"
                            name="bio"
                            value={formData.bio ?? ""}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us about yourself and your role..."
                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          />
                        ) : (
                          <motion.p
                            key="bio-view"
                            className="text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            {formData.bio || (
                              <em className="text-gray-500">
                                No bio provided yet.
                              </em>
                            )}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.section>

                    <Divider delay={0.2} />

                    {/* Official Information */}
                    <motion.section
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-10"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BadgeInfo className="text-blue-600" size={20} />
                        Official Information
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                          <InfoRow
                            icon={<Mail size={16} />}
                            label="Email"
                            name="officialEmail"
                            value={formData.officialEmail}
                            inputType="email"
                            disabled
                          />
                          <InfoRow
                            icon={<Phone size={16} />}
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                          />
                          <InfoRow
                            icon={<Phone size={16} />}
                            label="Alternate"
                            name="alternateContact"
                            value={formData.alternateContact}
                          />
                          <InfoRow
                            icon={<BadgeInfo size={16} />}
                            label="Designation"
                            name="designation"
                            value={formData.designation}
                          />
                          <InfoRow
                            icon={<Building2 size={16} />}
                            label="Department"
                            name="department"
                            value={formData.department}
                          />
                          <InfoRow
                            icon={<Globe size={16} />}
                            label="Jurisdiction"
                            name="jurisdictionArea"
                            value={formData.jurisdictionArea}
                          />
                        </div>
                      </div>
                    </motion.section>

                    <motion.section
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
                        <Building2 className="text-cyan-400" size={20} />
                        Office & Documentation
                      </h3>
                      <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                          <InfoRow
                            icon={<MapPin size={16} />}
                            label="Address"
                            name="officeAddress"
                            value={formData.officeAddress}
                            multiline
                          />
                          <InfoRow
                            icon={<MapPin size={16} />}
                            label="City"
                            name="city"
                            value={formData.city}
                          />
                          <InfoRow
                            icon={<MapPin size={16} />}
                            label="State"
                            name="state"
                            value={formData.state}
                          />
                          <InfoRow
                            icon={<MapPin size={16} />}
                            label="Pincode"
                            name="pincode"
                            value={formData.pincode}
                          />
                          <InfoRow
                            icon={<BadgeInfo size={16} />}
                            label="ID Type"
                            name="idProofType"
                            value={formData.idProofType}
                          />
                          <InfoRow
                            icon={<BadgeInfo size={16} />}
                            label="ID Number"
                            name="idProofNumber"
                            value={formData.idProofNumber}
                          />
                          <InfoRow
                            icon={<Globe size={16} />}
                            label="Website"
                            name="website"
                            value={formData.website}
                          />
                          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 py-3 group">
                            <div className="flex items-center gap-2 min-w-[180px]">
                              <FileText size={16} className="text-cyan-400" />
                              <span className="font-semibold text-gray-700">
                                Proof Document:
                              </span>
                            </div>
                            <div className="flex-1">
                              {isEditing ? (
                                <input
                                  name="proofDocumentUrl"
                                  value={formData.proofDocumentUrl ?? ""}
                                  onChange={handleChange}
                                  className="w-full bg-white text-gray-900 border border-cyan-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                                />
                              ) : formData.proofDocumentUrl ? (
                                <motion.a
                                  href={formData.proofDocumentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-800 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <FileText size={14} />
                                  View Document
                                </motion.a>
                              ) : (
                                <em className="text-gray-500">Not Provided</em>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.section>

                    <motion.section
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
                        <Globe className="text-cyan-400" size={20} />
                        Social Media & Online Presence
                      </h3>
                      <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(socialIcons).map(([key, Icon]) =>
                            isEditing ? (
                              <div
                                key={key}
                                className="flex items-center gap-3"
                              >
                                <Icon size={20} className="text-cyan-400" />
                                <input
                                  type="url"
                                  name={key}
                                  placeholder={`${
                                    key.charAt(0).toUpperCase() + key.slice(1)
                                  } URL`}
                                  value={getSocialLink(key)}
                                  onChange={handleSocialChange}
                                  className="flex-1 bg-white text-gray-900 border border-cyan-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                                />
                              </div>
                            ) : (
                              formData.socialLinks?.[key] && (
                                <motion.a
                                  key={key}
                                  href={formData.socialLinks[key]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center gap-3 p-2 bg-gray-200 rounded-lg hover:bg-cyan-100 transition-all duration-300 border border-gray-200 hover:border-cyan-400"
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Icon
                                    size={20}
                                    className="text-cyan-400 group-hover:text-cyan-600 transition-colors"
                                  />
                                  <span className="text-gray-700 group-hover:text-cyan-800 font-medium capitalize">
                                    {key}
                                  </span>
                                </motion.a>
                              )
                            )
                          )}
                          {!isEditing &&
                            Object.values(formData.socialLinks || {}).filter(
                              Boolean
                            ).length === 0 && (
                              <div className="col-span-full text-center py-6">
                                <Globe
                                  className="mx-auto text-gray-400 mb-2"
                                  size={32}
                                />
                                <p className="text-gray-400 text-base">
                                  No social media links provided
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </motion.section>

                    <motion.section
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
                        <Activity className="text-cyan-400" size={20} />
                        Recent Activity
                      </h3>
                      <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="space-y-3">
                          {[
                            {
                              time: "2 hours ago",
                              action:
                                "Resolved water supply issue in Sector 15",
                              status: "completed",
                            },
                            {
                              time: "1 day ago",
                              action:
                                "Approved construction permit for community center",
                              status: "completed",
                            },
                            {
                              time: "3 days ago",
                              action:
                                "Conducted public hearing for road development",
                              status: "in-progress",
                            },
                            {
                              time: "1 week ago",
                              action: "Launched digital grievance portal",
                              status: "completed",
                            },
                          ].map((activity, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-gray-200 rounded-lg hover:bg-cyan-50 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              <div
                                className={`p-2 rounded-full ${
                                  activity.status === "completed"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {activity.status === "completed" ? (
                                  <CheckCircle size={14} />
                                ) : (
                                  <Clock size={14} />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-700 font-medium">
                                  {activity.action}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {activity.time}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.section>
                  </div>
                  <Divider delay={0.7} />
                  <motion.div
                    className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center gap-2 text-cyan-700 mb-3 sm:ml-5">
                      <Calendar size={16} />
                      <span className="font-medium">
                        Member since{" "}
                        {formData.createdAt
                          ? new Date(formData.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    {isEditing && (
                      <motion.button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Save size={16} />
                        Save Changes
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfileGov;

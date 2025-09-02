import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Upload,
  Save,
  Edit3,
  ShieldCheck,
  AlertCircle,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import Header from "../../Layouts/Header/Header";
import Footer from "../../Layouts/Footer/Footer";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const socialIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { userId } = useParams();
  const { id } = useAuth();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await new Promise((r) => setTimeout(r, 500));
      const res = await axios.get(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/user/profile/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
      setFormData(res.data);
      console.log(userId);
    } catch {
      console.error("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token not found");
      return navigate("/login");
    }
    fetchUserProfile();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
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

  const handleSave = async () => {
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (key !== "socialLinks") {
          if (
            formData[key] !== undefined &&
            formData[key] !== null &&
            formData[key] !== ""
          ) {
            // Date format fix
            if (key === "dob") {
              formDataToSend.append(key, new Date(formData[key]).toISOString());
            } else if (key === "gender") {
              formDataToSend.append(key, formData[key].toLowerCase());
            } else {
              formDataToSend.append(key, formData[key]);
            }
          }
        }
      }

      // socialLinks
      formDataToSend.append(
        "socialLinks",
        JSON.stringify(formData.socialLinks || {})
      );

      // photo
      if (selectedPhoto) {
        formDataToSend.append("file", selectedPhoto);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/updateProfile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.user) {
        setUser(res.data.user);
        setFormData(res.data.user);
        setPhotoPreview(null);
        setSelectedPhoto(null);
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  const handleShare = async (userId) => {
    const shareUrl = `${window.location.origin}/user/profile/user/${userId}`;
    const shareData = {
      title: "CitiPulse User Profile",
      text: "Check out this user's CitiPulse profile.",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Profile link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
      toast.error("Failed to share or copy link.");
    }
  };

  const handleCancel = () => {
    setFormData(user); // Reset to original data
    setPhotoPreview(null);
    setSelectedPhoto(null);
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b  p-4 mt-10">
        <section className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 flex flex-col items-center text-white relative">
            <div className="relative w-36 h-36 ">
              <img
                src={
                  photoPreview || formData?.profilePhoto || "/placeholder.jpg"
                }
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-md"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow-md">
                  <Upload size={18} className="text-blue-600" />
                  <input
                    type="file"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Editable Name */}
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
                className="text-3xl font-bold mt-4 bg-transparent border-b-2 border-white text-center text-white placeholder-gray-200 focus:outline-none"
                placeholder="Enter your name"
              />
            ) : (
              <h1 className="text-3xl font-bold mt-4">{formData?.name}</h1>
            )}

            <p className="opacity-90">{formData?.email}</p>
            {id !== userId && (
              <button
                onClick={() => handleShare(userId)}
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded shadow-md"
              >
                Share Profile
              </button>
            )}
            {id === userId && (
              <div className="absolute top-4 right-4 flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={uploading}
                      className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={uploading}
                      className="bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600 transition"
                    >
                      <Save size={20} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-blue-600 p-2 rounded-full shadow hover:bg-blue-100 transition"
                  >
                    <Edit3 size={20} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Info Cards - Now Editable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <EditableStatCard
              label="Phone"
              name="phone"
              value={formData?.phone || ""}
              icon={<Phone className="text-green-500" />}
              isEditing={isEditing}
              onChange={handleChange}
              type="tel"
            />
            <EditableStatCard
              label="DOB"
              name="dob"
              value={formData?.dob?.split("T")[0] || ""}
              icon={<Calendar className="text-blue-400" />}
              isEditing={isEditing}
              onChange={handleChange}
              type="date"
            />
            <EditableStatCard
              label="Gender"
              name="gender"
              value={formData?.gender || ""}
              icon={<ShieldCheck className="text-indigo-400" />}
              isEditing={isEditing}
              onChange={handleChange}
              type="select"
              options={["Male", "Female", "Other"]}
            />
            <EditableStatCard
              label="City"
              name="city"
              value={formData?.city || ""}
              icon={<MapPin className="text-pink-400" />}
              isEditing={isEditing}
              onChange={handleChange}
              type="text"
            />
          </div>

          {/* About Section - Now Editable */}
          <div className="border-t px-6 pb-6">
            <h2 className="text-xl font-bold mt-6 mb-2 flex items-center gap-2">
              <FileText className="text-blue-600" /> About
            </h2>
            <div className="bg-gray-50 p-4 rounded-xl shadow-inner text-gray-700">
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData?.bio || ""}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              ) : (
                <>
                  {formData?.bio ? (
                    <p>{formData.bio}</p>
                  ) : (
                    <p className="italic text-gray-400">No bio provided yet.</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Official Info - Now Editable */}
          <div className="border-t px-6 pb-6">
            <h2 className="text-xl font-bold mt-6 mb-2 flex items-center gap-2">
              <Mail className="text-blue-600" /> Contact Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <EditableInfoRow
                label="Email"
                name="email"
                value={formData?.email || ""}
                isEditing={false} // Email usually shouldn't be editable
                onChange={handleChange}
                type="email"
              />
              <EditableInfoRow
                label="Phone"
                name="phone"
                value={formData?.phone || ""}
                isEditing={isEditing}
                onChange={handleChange}
                type="tel"
              />
              <EditableInfoRow
                label="Address"
                name="address"
                value={formData?.address || ""}
                isEditing={isEditing}
                onChange={handleChange}
                type="text"
              />
              <EditableInfoRow
                label="State"
                name="state"
                value={formData?.state || ""}
                isEditing={isEditing}
                onChange={handleChange}
                type="text"
              />
              <EditableInfoRow
                label="Pincode"
                name="pincode"
                value={formData?.pincode || ""}
                isEditing={isEditing}
                onChange={handleChange}
                type="text"
              />
              <EditableInfoRow
                label="Landmark"
                name="landmark"
                value={formData?.landmark || ""}
                isEditing={isEditing}
                onChange={handleChange}
                type="text"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t px-6 pb-10">
            <h2 className="text-xl font-bold mt-6 mb-2 flex items-center gap-2">
              <Globe className="text-blue-600" /> Social Links
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(socialIcons).map(([key, Icon]) => (
                <div key={key} className="flex items-center gap-2">
                  <Icon size={18} className="text-blue-600" />
                  <input
                    type="url"
                    name={key}
                    value={formData?.socialLinks?.[key] || ""}
                    onChange={handleSocialChange}
                    disabled={!isEditing}
                    placeholder={`Your ${key} link`}
                    className="flex-1 border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Enhanced StatCard component with editing capability
const EditableStatCard = ({
  label,
  name,
  value,
  icon,
  isEditing,
  onChange,
  type = "text",
  options = [],
}) => (
  <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
    <div className="p-2 rounded-full bg-gray-100">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-gray-500">{label}</div>
      {isEditing ? (
        type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="text-lg font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="text-lg font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )
      ) : (
        <div className="text-lg font-semibold text-gray-800">
          {value || <span className="text-gray-400 italic">Not Provided</span>}
        </div>
      )}
    </div>
  </div>
);

// Enhanced InfoRow component with editing capability
const EditableInfoRow = ({
  label,
  name,
  value,
  isEditing,
  onChange,
  type = "text",
}) => (
  <div className="bg-gray-50 p-3 rounded-xl shadow-sm flex justify-between items-center">
    <span className="text-gray-600 font-medium">{label}:</span>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="text-gray-800 bg-white border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 ml-2"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ) : (
      <span className="text-gray-800">
        {value || <span className="text-gray-400 italic">Not Provided</span>}
      </span>
    )}
  </div>
);

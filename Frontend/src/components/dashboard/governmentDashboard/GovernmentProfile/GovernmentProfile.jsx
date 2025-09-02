import React, { useEffect, useState } from "react";
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
  ShieldCheck,
  Eye,
  Copy,
  Share2,
  Star,
  Heart,
  Users,
  Calendar,
  Award,
  TrendingUp,
  Activity,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";

// Enhanced InfoRow with professional styling
const InfoRow = ({
  icon,
  label,
  value,
  copyable = false,
  animated = false,
  isLink = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    if (copyable && value) {
      navigator.clipboard.writeText(
        typeof value === "string" ? value : value.props.children
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 border
        ${
          animated
            ? "hover:bg-blue-50 hover:shadow-md hover:border-blue-200"
            : "border-gray-100"
        }
        ${isHovered ? "bg-gray-50" : "bg-white"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 sm:min-w-[180px]">
        <span
          className={`text-blue-600 transition-all duration-300 ${
            isHovered ? "scale-110" : ""
          }`}
        >
          {icon}
        </span>
        <span className="font-semibold text-gray-700 text-sm sm:text-base">
          {label}:
        </span>
      </div>
      <div className="flex-1 flex items-center gap-2 ml-7 sm:ml-0">
        {value ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-900 break-all text-sm sm:text-base">
              {value}
            </span>
            {copyable && (
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            )}
          </div>
        ) : (
          <em className="text-gray-400 text-sm">Not Provided</em>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} p-4 sm:p-6 rounded-xl border-2
      hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 sm:p-3 rounded-lg bg-white/70 shadow-sm`}>
          <span className={`${colorClasses[color].split(" ")[2]}`}>{icon}</span>
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-600 text-xs sm:text-sm font-medium">
        {label}
      </div>
    </div>
  );
};

const GovernmentProfile = () => {
  const [gov, setGov] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [likedProfile, setLikedProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {id} = useAuth();

  useEffect(() => {
    const fetchGovProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          sessionStorage.getItem("token") || localStorage.getItem("token");

        if (!token) {
          setError("Authentication token not found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/gov/profile/government/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please login again.");
          } else if (response.status === 404) {
            setError("Profile not found.");
          } else {
            setError(
              `Failed to fetch profile: ${response.status} ${response.statusText}`
            );
          }
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (typeof data.socialLinks === "string") {
          try {
            data.socialLinks = JSON.parse(data.socialLinks);
          } catch (err) {
            console.warn("Invalid JSON in socialLinks:", err);
            data.socialLinks = {};
          }
        }
        setGov(data);
      } catch (error) {
        console.error("Error fetching government profile:", error);
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          setError(
            "Unable to connect to server. Please check your connection."
          );
        } else {
          setError("An unexpected error occurred while fetching the profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGovProfile();
  }, []);  

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${gov?.authorityName || "Government"} - Government Profile`,
        text: `Check out ${gov?.authorityName || "this government"}'s profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can replace this with your toast notification system
      alert("Profile link copied to clipboard!");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <BadgeInfo size={18} /> },
    { id: "contact", label: "Contact", icon: <Phone size={18} /> },
    { id: "documents", label: "Documents", icon: <FileText size={18} /> },
    { id: "social", label: "Social", icon: <Globe size={18} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-blue-700 text-lg sm:text-xl font-semibold">
            Loading Profile...
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Fetching government data
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!gov) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <span className="text-red-600 text-lg">
            No profile data available.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-8 px-4 font-sans">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 transform rotate-12 scale-150"></div>
          </div>

          {/* Mobile Action Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden absolute top-16 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setLikedProfile(!likedProfile);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    likedProfile ? "bg-red-50 text-red-600" : "hover:bg-gray-50"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={likedProfile ? "currentColor" : "none"}
                  />
                  <span className="text-sm font-medium">
                    {likedProfile ? "Unlike" : "Like"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSavedProfile(!savedProfile);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    savedProfile
                      ? "bg-yellow-50 text-yellow-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Star
                    size={18}
                    fill={savedProfile ? "currentColor" : "none"}
                  />
                  <span className="text-sm font-medium">
                    {savedProfile ? "Unsave" : "Save"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    handleShare();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 size={18} />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-8 relative z-10 mt-8 sm:mt-0">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative group">
                <img
                  src={
                    gov.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      gov.authorityName || "Gov Profile"
                    )}&background=3b82f6&color=fff`
                  }
                  alt={gov.authorityName || "Government Profile"}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-blue-500 shadow-xl object-cover bg-gray-100 
                    transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                  onError={(e) =>
                    (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      gov.authorityName || "Gov Profile"
                    )}&background=3b82f6&color=fff`)
                  }
                />
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
                >
                  <Eye size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  {gov.isVerified ? (
                    <div className="bg-green-500 p-2 sm:p-3 rounded-full shadow-lg border-2 border-white">
                      <ShieldCheck size={24} className="text-white" />
                    </div>
                  ) : (
                    <div className="bg-yellow-500 p-2 sm:p-3 rounded-full shadow-lg border-2 border-white">
                      <AlertCircle size={24} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Status */}
              <div className="mt-4 text-center lg:text-left">
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                  bg-clip-text text-transparent mb-2"
                >
                  {gov.authorityName || "Not Provided"}
                </h1>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-3">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                    ${
                      gov.isVerified
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    }`}
                  >
                    {gov.isVerified ? (
                      <>
                        <CheckCircle size={14} /> Verified Authority
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} /> Pending Verification
                      </>
                    )}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-blue-300">
                    <Activity size={12} className="inline mr-1" />
                    Active
                  </span>
                </div>
                <div className="text-gray-700 text-base sm:text-lg font-semibold">
                  {gov.designation} {gov.department && <>| {gov.department}</>}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {gov.jurisdictionArea}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                icon={<CheckCircle size={24} />}
                label="Issues Resolved"
                value={gov.resolvedIssuesCount ?? 0}
                color="green"
              />
              <StatCard
                icon={<Calendar size={24} />}
                label="Member Since"
                value={
                  gov.createdAt ? new Date(gov.createdAt).getFullYear() : "N/A"
                }
                color="blue"
              />
              <StatCard
                icon={<Building2 size={24} />}
                label="Department"
                value={gov.authorityName ? "Active" : "N/A"}
                color="purple"
              />
            </div>
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Content Based on Active Tab */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <BadgeInfo size={24} className="text-blue-600" />
                  Professional Overview
                </h2>
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-1">
                    <InfoRow
                      icon={<BadgeInfo size={18} />}
                      label="Designation"
                      value={gov.designation}
                      animated
                    />
                    <InfoRow
                      icon={<Building2 size={18} />}
                      label="Department"
                      value={gov.department}
                      animated
                    />
                    <InfoRow
                      icon={<Globe size={18} />}
                      label="Jurisdiction"
                      value={gov.jurisdictionArea}
                      animated
                    />
                    <InfoRow
                      icon={<Calendar size={18} />}
                      label="Member Since"
                      value={
                        gov.createdAt
                          ? new Date(gov.createdAt).toLocaleDateString()
                          : "N/A"
                      }
                      animated
                    />
                  </div>
                  <div className="space-y-1">
                    <InfoRow
                      icon={<MapPin size={18} />}
                      label="City"
                      value={gov.city}
                      animated
                    />
                    <InfoRow
                      icon={<MapPin size={18} />}
                      label="State"
                      value={gov.state}
                      animated
                    />
                    <InfoRow
                      icon={<MapPin size={18} />}
                      label="Pincode"
                      value={gov.pincode}
                      animated
                    />
                    <InfoRow
                      icon={<CheckCircle size={18} />}
                      label="Resolved Issues"
                      value={gov.resolvedIssuesCount ?? 0}
                      animated
                    />
                  </div>
                </div>
              </div>

              {gov.bio && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                    Biography
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                      {showFullBio
                        ? gov.bio
                        : `${gov.bio.substring(0, 200)}${
                            gov.bio.length > 200 ? "..." : ""
                          }`}
                    </p>
                    {gov.bio.length > 200 && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="mt-3 sm:mt-4 text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 font-medium text-sm sm:text-base"
                      >
                        {showFullBio ? "Show Less" : "Read More"}
                        {showFullBio ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "contact" && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Phone size={24} className="text-blue-600" />
                Contact Information
              </h2>
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">
                    Official Contact
                  </h3>
                  <div className="space-y-1">
                    <InfoRow
                      icon={<Mail size={18} />}
                      label="Email"
                      value={gov.officialEmail}
                      copyable
                      animated
                    />
                    <InfoRow
                      icon={<Phone size={18} />}
                      label="Phone"
                      value={gov.phone}
                      copyable
                      animated
                    />
                    <InfoRow
                      icon={<Phone size={18} />}
                      label="Alternate"
                      value={gov.alternateContact}
                      copyable
                      animated
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">
                    Office Address
                  </h3>
                  <div className="space-y-1">
                    <InfoRow
                      icon={<MapPin size={18} />}
                      label="Address"
                      value={gov.officeAddress}
                      animated
                    />
                    <InfoRow
                      icon={<MapPin size={18} />}
                      label="City"
                      value={gov.city}
                      animated
                    />
                    <InfoRow
                      icon={<MapPin size={18} />}
                      label="State"
                      value={gov.state}
                      animated
                    />
                    <InfoRow
                      icon={<MapPin size={18} />}
                      label="Pincode"
                      value={gov.pincode}
                      copyable
                      animated
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "documents" && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText size={24} className="text-blue-600" />
                Documents & Verification
              </h2>
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">
                    Identity Verification
                  </h3>
                  <div className="space-y-1">
                    <InfoRow
                      icon={<BadgeInfo size={18} />}
                      label="ID Type"
                      value={gov.idProofType}
                      animated
                    />
                    <InfoRow
                      icon={<BadgeInfo size={18} />}
                      label="ID Number"
                      value={gov.idProofNumber}
                      animated
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">
                    Official Documents
                  </h3>
                  <div className="space-y-1">
                    <InfoRow
                      icon={<FileText size={18} />}
                      label="Proof Document"
                      value={
                        gov.proofDocumentUrl ? (
                          <a
                            href={gov.proofDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-700 font-medium"
                          >
                            View Document
                          </a>
                        ) : null
                      }
                      animated
                    />
                    <InfoRow
                      icon={<Globe size={18} />}
                      label="Website"
                      value={
                        gov.website ? (
                          <a
                            href={gov.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-700 font-medium break-all"
                          >
                            {gov.website}
                          </a>
                        ) : null
                      }
                      animated
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "social" && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Globe size={24} className="text-blue-600" />
                Social Media & Online Presence
              </h2>
              {console.log("length: ", gov.socialLinks.length)}
              {gov.socialLinks && gov.socialLinks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gov.socialLinks.twitter && (
                    <a
                      href={gov.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl 
                        hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-105 group"
                    >
                      <Twitter
                        size={24}
                        className="text-blue-500 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-blue-700 font-semibold">
                        Twitter
                      </span>
                    </a>
                  )}
                  {gov.socialLinks.linkedin && (
                    <a
                      href={gov.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-all duration-300 hover:scale-105 group"
                    >
                      <Linkedin
                        size={24}
                        className="text-blue-600 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-blue-800 font-semibold">
                        LinkedIn
                      </span>
                    </a>
                  )}
                  {gov.socialLinks.instagram && (
                    <a
                      href={gov.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-pink-50 border-2 border-pink-200 rounded-xl hover:bg-pink-100 hover:border-pink-300 transition-all duration-300 hover:scale-105 group"
                    >
                      <Instagram
                        size={24}
                        className="text-pink-500 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-pink-700 font-semibold">
                        Instagram
                      </span>
                    </a>
                  )}
                  {gov.socialLinks.facebook && (
                    <a
                      href={gov.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-105 group"
                    >
                      <Facebook
                        size={24}
                        className="text-blue-600 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-blue-700 font-semibold">
                        Facebook
                      </span>
                    </a>
                  )}
                  {gov.socialLinks.youtube && (
                    <a
                      href={gov.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-300 hover:scale-105 group"
                    >
                      <Youtube
                        size={24}
                        className="text-red-500 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-red-700 font-semibold">
                        YouTube
                      </span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Globe size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No social media links available
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default GovernmentProfile;

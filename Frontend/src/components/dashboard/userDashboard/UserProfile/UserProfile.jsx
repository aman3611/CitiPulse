import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  User as UserIcon,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const InfoRow = ({ icon, label, value, animated }) => (
  <motion.div
    className="flex items-start gap-2 py-2 px-2 rounded-md group transition-all"
    whileHover={animated ? { scale: 1.02 } : {}}
  >
    <span className="text-blue-500">{icon}</span>
    <span className="min-w-[110px] font-semibold text-gray-700">{label}:</span>
    <span className="flex-1 text-gray-800 break-words">
      {value || <em className="text-gray-400">Not Provided</em>}
    </span>
  </motion.div>
);

const socialIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

const shimmer =
  "bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 animate-pulse";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBio, setShowBio] = useState(false);
  const { id } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return toast.error("Token not found");

        const res = await axios.get(
          `${
            import.meta.env.VITE_CITIPULSE_BACKEND_URL
          }/api/user/profile/user/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data);
      } catch (error) {
        toast.error("Failed to fetch profile");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-white">
        <div className={`rounded-full h-20 w-20 ${shimmer}`} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-white">
        <span className="text-red-500 text-lg">Failed to load profile.</span>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-br from-white via-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
          <div className="flex flex-col items-center w-full md:w-1/3">
            <motion.div className="relative" whileHover={{ scale: 1.04 }}>
              <img
                alt={user.name}
                src={user.profilePhoto}
                className="w-32 h-32 rounded-full border-4 border-blue-400 object-cover shadow"
                onError={(e) =>
                  (e.target.src = "https://ui-avatars.com/api/?name=User")
                }
              />
            </motion.div>
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                {user.name || "Not Provided"}
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
                    user.isVerified
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-yellow-100 text-yellow-700 border-yellow-300"
                  }`}
                >
                  {user.isVerified ? (
                    <>
                      <CheckCircle size={16} /> Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} /> Not Verified
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 w-full">
            <h2 className="text-lg font-semibold text-blue-600 mb-3">
              Basic Info
            </h2>
            <InfoRow
              icon={<Mail size={18} />}
              label="Email"
              value={user.email}
              animated
            />
            <InfoRow
              icon={<Phone size={18} />}
              label="Phone"
              value={user.phone}
              animated
            />
            <InfoRow
              icon={<CalendarDays size={18} />}
              label="DOB"
              value={user.dob?.slice(0, 10)}
              animated
            />
            <InfoRow
              icon={<UserIcon size={18} />}
              label="Gender"
              value={user.gender}
              animated
            />
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200" />

        {/* Address & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-3">
              Address
            </h2>
            <InfoRow
              icon={<MapPin size={18} />}
              label="Address"
              value={user.address}
              animated
            />
            <InfoRow
              icon={<MapPin size={18} />}
              label="City"
              value={user.city}
              animated
            />
            <InfoRow
              icon={<MapPin size={18} />}
              label="State"
              value={user.state}
              animated
            />
            <InfoRow
              icon={<MapPin size={18} />}
              label="Pincode"
              value={user.pincode}
              animated
            />
            <InfoRow
              icon={<MapPin size={18} />}
              label="Landmark"
              value={user.landmark}
              animated
            />
          </div>

          {/* Bio */}
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-3">Bio</h2>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 min-h-[100px] text-gray-700">
              <AnimatePresence mode="wait">
                <motion.p
                  key={showBio ? "bio-full" : "bio-short"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="whitespace-pre-line text-sm"
                >
                  {user.bio ? (
                    showBio || user.bio.length < 200 ? (
                      user.bio
                    ) : (
                      `${user.bio.slice(0, 200)}...`
                    )
                  ) : (
                    <em>No bio available.</em>
                  )}
                </motion.p>
              </AnimatePresence>
              {user.bio && user.bio.length > 200 && (
                <button
                  onClick={() => setShowBio((v) => !v)}
                  className="mt-2 text-blue-600 hover:underline text-xs"
                >
                  {showBio ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        {user.socialLinks && Object.values(user.socialLinks).some(Boolean) && (
          <>
            <div className="my-8 border-t border-gray-200" />
            <h2 className="text-lg font-semibold text-blue-600 mb-3">
              Social Media
            </h2>
            <div className="flex gap-5 flex-wrap items-center">
              {Object.entries(socialIcons).map(
                ([key, Icon]) =>
                  user.socialLinks[key] && (
                    <a
                      key={key}
                      href={user.socialLinks[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-600 transition"
                    >
                      <Icon size={26} />
                    </a>
                  )
              )}
            </div>
          </>
        )}

        {/* Footer Info */}
        <div className="mt-10 text-sm text-right text-gray-500">
          Member since:{" "}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A"}
        </div>
      </div>
    </main>
  );
};

export default UserProfile;

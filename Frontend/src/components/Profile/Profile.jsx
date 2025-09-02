import React from "react";
import { useAuth } from "../Context/AuthContext";
import ProfileUser from "./ProfileUser/ProfileUser";
import ProfileGov from "./ProfileGovernment/ProfileGov";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { role } = useParams();

  if (!role) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-opacity-50"></div>
        <p className="mt-3 text-gray-600">Loading role...</p>
      </div>
    );
  }

  if (role === "user") {
    return <ProfileUser />;
  }

  if (role === "government") {
    return <ProfileGov />;
  }

  return (
    <div className="p-6 text-red-600">
      <h2 className="text-lg font-semibold">Unknown role: {role}</h2>
    </div>
  );
};

export default Profile;

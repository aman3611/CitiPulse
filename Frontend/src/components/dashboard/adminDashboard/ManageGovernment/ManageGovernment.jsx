import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const ManageGovernment = () => {
  const [governments, setGovernments] = useState([]);

  const fetchGovernments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/admin/allGovernments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.governments);
      setGovernments(res.data.governments);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch governments");
    }
  };

  const verifyGovernment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/admin/verifyGovernment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      fetchGovernments(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify government");
    }
  };

  const deleteGovernment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/admin/deleteGovernment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Government account deleted");
      setGovernments((prev) => prev.filter((gov) => gov._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete government");
    }
  };

  useEffect(() => {
    fetchGovernments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-gray-800">
      <Toaster />
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        Manage Government Accounts
      </h2>

      {governments.length === 0 ? (
        <p className="text-gray-500">No government users found.</p>
      ) : (
        <div className="grid gap-6">
          {governments.map((gov) => (
            <div
              key={gov._id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Authority Name:</strong>{" "}
                  <Link
                    className="text-blue-600 underline"
                    to={`/user/profile/${gov.role}/${gov._id}`}
                  >
                    {gov.authorityName}
                  </Link>
                </p>
                <p>
                  <strong>Email:</strong> {gov.officialEmail}
                </p>
                <p>
                  <strong>Resolved Issues:</strong> {gov.resolvedIssuesCount}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-0">
                {!gov.isVerified && (
                  <button
                    onClick={() => verifyGovernment(gov._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={() => deleteGovernment(gov._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                  title="Delete"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageGovernment;

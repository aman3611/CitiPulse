import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/admin/allUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${
          import.meta.env.VITE_CITIPULSE_BACKEND_URL
        }/api/admin/deleteUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User deleted");
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-gray-800">
      <Toaster />
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Manage Users</h2>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-lg font-semibold text-blue-600 underline ">
                    <Link to={`/user/profile/user/${user._id}`}>
                      {user.name}
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className="inline-block mt-1 text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-600 hover:text-red-700 bg-red-100 p-2 rounded-full"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

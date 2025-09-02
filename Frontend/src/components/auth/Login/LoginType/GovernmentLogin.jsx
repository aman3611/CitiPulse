import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Lock, Gavel, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

const GovernmentLogin = () => {
  const [form, setForm] = useState({ officialEmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!form.officialEmail || !form.password) {
      return toast.error("Please fill in all fields");
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/gov/login`,
        form
      );

      const token = data.token;
      const decoded = decodeToken(token);
      if (decoded?.role === "government") {
        login(token);
        toast.success("Government logged in!");
        navigate("/");
      } else {
        toast.error("Access denied: Not a government account");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 px-4 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Gavel className="text-blue-600" size={28} />
          <h2 className="text-xl font-semibold text-gray-800">
            Government Login
          </h2>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Official Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Mail size={18} />
            </span>
            <input
              type="email"
              name="officialEmail"
              value={form.officialEmail}
              onChange={handleChange}
              placeholder="gov@example.com"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default GovernmentLogin;

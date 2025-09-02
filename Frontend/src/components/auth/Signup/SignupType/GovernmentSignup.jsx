import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  CloudUpload,
  Mail,
  Lock,
  Phone,
  Landmark,
  Building,
} from "lucide-react";

const GovernmentSignup = () => {
  const [form, setForm] = useState({
    department: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    proofDoc: null,
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "proofDoc") {
      setForm((prev) => ({ ...prev, proofDoc: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    const { password, confirmPassword, email, phone, proofDoc } = form;

    if (!email || !password || !confirmPassword || !phone || !proofDoc) {
      return toast.error("Please fill all required fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("Invalid email format");
    }

    if (!/^\d{10}$/.test(phone)) {
      return toast.error("Phone must be exactly 10 digits");
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/gov/signup`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status !== 201) throw new Error("Registration failed");
      toast.success("Government account registered!");

      setForm({
        department: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        city: "",
        proofDoc: null,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 px-4 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-gray-200 rounded-xl bg-white shadow p-6"
      >
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
          Government Signup
        </h2>

        {/* Input Group */}
        <div className="space-y-4 text-sm">
          {/* Department */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Department
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Building size={18} />
              </span>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                placeholder="Public Works Dept."
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Official Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                placeholder="official@gov.in"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPass ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Phone
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Phone size={18} />
              </span>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="8305052647"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              City / Region
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Landmark size={18} />
              </span>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Noida"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Upload Proof */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Upload Government Proof
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-blue-500 text-blue-600 rounded-md cursor-pointer hover:bg-blue-50">
                <CloudUpload size={18} />
                <span>Choose File</span>
                <input
                  type="file"
                  name="proofDoc"
                  accept="image/*,application/pdf"
                  hidden
                  onChange={handleChange}
                />
              </label>
              {form.proofDoc && (
                <span className="text-sm text-gray-700 truncate max-w-[150px]">
                  {form.proofDoc.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default GovernmentSignup;

import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import Header from "../../Layouts/Header/Header";
import Footer from "../../Layouts/Footer/Footer";
import UserLogin from "./LoginType/UserLogin";
import GovernmentLogin from "./LoginType/GovernmentLogin";
import AdminLogin from "./LoginType/AdminLogin";
import { UserCircle, Landmark, ShieldCheck } from "lucide-react";

const Login = () => {
  const [selected, setSelected] = useState("user");

  const roles = [
    {
      id: "user",
      label: "User",
      icon: <UserCircle className="w-10 h-10 mb-2 text-blue-600" />,
    },
    {
      id: "government",
      label: "Government",
      icon: <Landmark className="w-10 h-10 mb-2 text-blue-600" />,
    },
    {
      id: "admin",
      label: "Admin",
      icon: <ShieldCheck className="w-10 h-10 mb-2 text-blue-600" />,
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-12">
          <Toaster position="top-right" />
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Select your login role to continue
            </p>

            {/* Role Selection */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelected(role.id)}
                  className={`group flex-1 border rounded-lg px-4 py-6 text-center transition-all duration-300 ${
                    selected === role.id
                      ? "bg-blue-100 border-blue-600 shadow-md"
                      : "bg-gray-50 hover:bg-blue-50 hover:border-blue-400 border-gray-200"
                  }`}
                >
                  <div className="flex justify-center mb-2">{role.icon}</div>
                  <p
                    className={`text-sm font-semibold ${
                      selected === role.id
                        ? "text-blue-700"
                        : "text-gray-700 group-hover:text-blue-600"
                    }`}
                  >
                    {role.label}
                  </p>
                </button>
              ))}
            </div>

            {/* Conditional Form Render */}
            {selected === "user" && <UserLogin />}
            {selected === "government" && <GovernmentLogin />}
            {selected === "admin" && <AdminLogin />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  PlusCircle,
  LayoutDashboard,
  ThumbsUp,
  ThumbsDown,
  MessageSquareText,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Header from "../../Layouts/Header/Header";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    {
      label: "Home",
      icon: <Home size={18} />,
      path: "/user/dashboard",
    },
    {
      label: "Create Issue",
      icon: <PlusCircle size={18} />,
      path: "/user/dashboard/createPost",
    },
    {
      label: "My Issues",
      icon: <LayoutDashboard size={18} />,
      path: "/user/dashboard/userPosts",
    },
    {
      label: "Other Issues",
      icon: <LayoutDashboard size={18} />,
      path: "/",
    },
    {
      label: "Upvoted Issues",
      icon: <ThumbsUp size={18} />,
      path: "/user/dashboard/upvotedIssues",
    },
    {
      label: "Downvoted Issues",
      icon: <ThumbsDown size={18} />,
      path: "/user/dashboard/downvotedIssues",
    },
    {
      label: "Community Chat",
      icon: <MessageSquareText size={18} />,
      path: "/user/dashboard/communityChat",
    },
    {
      label: "Profile",
      icon: <User size={18} />,
      path: "/user/dashboard/userProfile",
    },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      path: "/user/dashboard/settings",
    },
  ];

  const isActive = (path) => location.pathname === path;

  const Sidebar = ({ mobile }) => (
    <motion.aside
      initial={{ x: mobile ? -300 : 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        mobile
          ? "fixed top-[70px] left-0 z-50 w-[250px] h-full"
          : "hidden md:flex w-[250px]"
      } flex-col gap-4 bg-white border-r border-gray-200 shadow-md px-4 py-6`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        {mobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={22} />
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {navLinks.map(({ label, icon, path }, idx) => (
          <motion.li key={idx} whileHover={{ scale: 1.03 }}>
            <button
              onClick={() => {
                navigate(path);
                if (mobile) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition shadow-sm border ${
                isActive(path)
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-200"
              }`}
            >
              {icon}
              {label}
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  );

  return (
    <>
      <Header />

      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-700 hover:text-blue-600 bg-gray-100 px-3 py-2 rounded-md"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-70px)] bg-gray-50">
        {/* Desktop Sidebar */}
        <Sidebar mobile={false} />

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && <Sidebar mobile={true} />}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 px-4 sm:px-8 py-8 bg-gradient-to-br from-white to-blue-50/40"
        >
          <Outlet />
        </motion.main>
      </div>
    </>
  );
};

export default UserDashboard;

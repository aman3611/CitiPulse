import React from "react";
import { motion } from "framer-motion";

const UserDashboardWelcome = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center items-center px-6 py-12 sm:py-16 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow"
    >
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 text-center text-blue-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        Welcome Back 👋
      </motion.h1>
      <motion.p
        className="text-gray-600 text-center max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Manage your profile, view your own reports, and explore civic issues
        across the city — all from your unified dashboard.
      </motion.p>
    </motion.div>
  );
};

export default UserDashboardWelcome;

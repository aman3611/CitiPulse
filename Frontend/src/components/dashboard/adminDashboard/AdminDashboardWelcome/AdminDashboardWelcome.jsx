import React from "react";
import { motion } from "framer-motion";

const AdminDashboardWelcome = () => {
  return (
    <div className="w-full px-4 py-10 sm:px-6 md:px-10 max-w-4xl mx-auto text-center bg-white shadow-sm rounded-xl">
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        👋 Hello Admin
      </motion.h1>

      <motion.p
        className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Manage users, oversee public posts, and monitor government activity with
        complete control. Keep the platform secure, transparent, and running
        smoothly for everyone.
      </motion.p>
    </div>
  );
};

export default AdminDashboardWelcome;

import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 text-[#111] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center p-8 rounded-xl shadow-xl bg-white/80 backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-24 w-24 text-yellow-500 animate-bounce" />
        </div>
        <h1 className="text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-800 mb-2">
          Lost in the city?
        </p>
        <p className="text-base text-gray-600 mb-6">
          Looks like the road you're trying to take doesn’t exist. You might've
          taken a wrong turn.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition duration-200 shadow-md"
        >
          🏠 Take me home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;

import React from "react";
import Header from "../Layouts/Header/Header";
import Footer from "../Layouts/Footer/Footer";

const About = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen px-6 py-12 md:px-20 lg:px-40 bg-white text-[#111]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#222]">
            About <span className="text-[#0d9488]">CitiPulse</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            CitiPulse is a modern civic issue resolution platform that empowers
            citizens to take action and improve their communities. Whether it’s
            potholes, broken streetlights, or sanitation issues — CitiPulse lets
            you report, track, and share problems in just a few clicks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mt-12">
          <div className="bg-[#f9f9f9] p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-[#0d9488]">
              What We Do
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We provide a transparent platform for citizens to raise geo-tagged
              complaints with photographic proof and track their resolution
              status. Our integration with government systems ensures that
              issues are not just seen — but solved.
            </p>
          </div>

          <div className="bg-[#f9f9f9] p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-[#0d9488]">
              Why It Matters
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Many civic issues go unresolved due to lack of visibility. Citipulse
              bridges the gap between citizens and authorities, creating a more
              accountable and responsive system for everyday problems that
              affect quality of life.
            </p>
          </div>

          <div className="bg-[#f9f9f9] p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-[#0d9488]">
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Location-based issue reporting</li>
              <li>Upload photos for evidence</li>
              <li>Real-time status tracking</li>
              <li>Public voting and visibility</li>
              <li>Auto-sharing to social platforms</li>
            </ul>
          </div>

          <div className="bg-[#f9f9f9] p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-[#0d9488]">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We believe in cleaner, smarter, and more responsive cities.
              Citipulse is not just a reporting tool — it's a movement that brings
              citizens, communities, and authorities together to build better
              urban experiences.
            </p>
          </div>
        </div>

        <div className="text-center mt-20">
          <h3 className="text-2xl font-semibold mb-4 text-[#0d9488]">
            Be Part of the Change
          </h3>
          <p className="text-gray-600">
            Take action today. Report civic issues. Improve your city. Join the
            CitiPulse movement.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;

import React from "react";
import Header from "../Layouts/Header/Header";
import Footer from "../Layouts/Footer/Footer";

const Contact = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen px-6 py-12 md:px-20 lg:px-40 bg-white text-[#111]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#222]">
            Contact <span className="text-[#0d9488]">Us</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Have a question, feedback, or partnership inquiry? We'd love to hear
            from you. Fill out the form below and we'll get back to you shortly.
          </p>
        </div>

        <form className="max-w-3xl mx-auto bg-[#f9f9f9] p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows="5"
              placeholder="Your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#0d9488] hover:bg-[#0b7c72] text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Send Message
          </button>
        </form>

        <div className="text-center mt-16 text-gray-600">
          <p>Or reach out to us directly at</p>
          <a
            href="mailto:contact@citiPulse.in"
            className="text-[#0d9488] font-medium hover:underline"
          >
            contact@CitiPulse.in
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;

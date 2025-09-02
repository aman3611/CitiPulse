import React from "react";
import {
  Code,
  Github,
  Linkedin,
  Mail,
  Globe,
  MessageSquare,
} from "lucide-react";
import Header from "../Layouts/Header/Header";
import Footer from "../Layouts/Footer/Footer";

const developers = [
  {
    name: "Aman Gupta",
    role: "Web Developer & Software Engineer",
    avatar: "https://avatars.githubusercontent.com/u/193778631?v=4",
    portfolio: "https://aman-portfolio2505.netlify.app/",
    github: "https://github.com/aman3611",
    linkedin: "www.linkedin.com/in/aman-gupta-49825b326",
    email: "amangupta3611@gmail.com",
  },

];

const Developers = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#ecf3ff] to-[#e7f0ff] py-20 px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-900 tracking-tight">
          👨‍💻 The Minds Behind <span className="text-blue-600">CitiPulse</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {developers.map((dev, idx) => (
            <div
              key={idx}
              className="relative group bg-white/60 backdrop-blur-xl border border-blue-100 shadow-xl hover:shadow-2xl rounded-3xl p-8 text-center transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Glow effect */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 group-hover:scale-150 transition-transform blur-md opacity-50" />

              <Code className="mx-auto text-blue-600 w-9 h-9 mb-4 animate-pulse" />

              <img
                src={dev.avatar}
                alt={dev.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
              />

              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {dev.name}
              </h2>
              <p className="text-blue-500 mb-4 font-medium">{dev.role}</p>

              <div className="flex justify-center gap-4 flex-wrap mt-4">
                <a
                  href={dev.portfolio}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110"
                  aria-label="Portfolio"
                >
                  <Globe />
                </a>
                <a
                  href={dev.github}
                  target="_blank"
                  className="text-gray-700 hover:text-black transition transform hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github />
                </a>
                <a
                  href={dev.linkedin}
                  target="_blank"
                  className="text-blue-700 hover:text-blue-900 transition transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin />
                </a>
                <a
                  href={`mailto:${dev.email}`}
                  className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                  aria-label="Email"
                >
                  <Mail />
                </a>
                {dev.telegram && (
                  <a
                    href={dev.telegram}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-600 transition transform hover:scale-110"
                    aria-label="Telegram"
                  >
                    <MessageSquare />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-20 text-sm">
          Built with 💙 by developers who care about the city.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Developers;

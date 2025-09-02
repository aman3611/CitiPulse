import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", url: "/about" },
    { name: "Services", url: "/services" },
    { name: "Contact", url: "/contact" },
    { name: "Privacy Policy", url: "/policy" },
    { name: "Terms of Service", url: "/terms" },
  ];

  const services = [
    { name: "Report Issues", url: "/report" },
    { name: "Track Progress", url: "/track" },
    { name: "City Updates", url: "/updates" },
    { name: "Community Forum", url: "/forum" },
    { name: "Help Center", url: "/help" },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, url: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, url: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, url: "#", label: "Instagram" },
    { icon: <Linkedin size={20} />, url: "#", label: "LinkedIn" },
    { icon: <Github size={20} />, url: "#", label: "GitHub" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">CitiPulse</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Transforming urban living through innovation. Connecting citizens
            with local authorities to build smarter, more responsive cities.
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="text-blue-600 mt-1" size={18} />
              <div>
                <p className="text-gray-500">Email Us</p>
                <p className="font-medium text-gray-700">contact@citipulse.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-blue-600 mt-1" size={18} />
              <div>
                <p className="text-gray-500">Call Us</p>
                <p className="font-medium text-gray-700">+91 8305052647</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 mt-1" size={18} />
              <div>
                <p className="text-gray-500">Visit Us</p>
                <p className="font-medium text-gray-700">
                  Gautam Buddha Nagar Sector-62
                  <br />
                  Noida, India 201309
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.url}
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
                  >
                    {link.name}
                    <ArrowRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-3">
              Services
            </h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.url}
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
                  >
                    {service.name}
                    <ArrowRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold text-blue-700 mb-3">
            Stay Connected
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Join our community and stay updated with the latest improvements and
            features.
          </p>
          <div className="flex gap-3">
            {socialLinks.map((item) => (
              <a
                href={item.url}
                key={item.label}
                className="w-10 h-10 bg-gray-100 hover:bg-blue-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition"
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 text-sm text-center py-4 px-4 text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span>
            © 2025 CitiPulse. All rights reserved. Built with ❤️ by{" "}
            <a href="/developers" className="text-blue-600 hover:underline">
              Aman Gupta
            </a>{" "}
            for better cities.
          </span>
          <div className="flex gap-4">
            <Link to="/policy" className="hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

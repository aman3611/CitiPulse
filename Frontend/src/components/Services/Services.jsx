import React from "react";
import Header from "../Layouts/Header/Header";
import Footer from "../Layouts/Footer/Footer";

const Services = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen px-6 py-12 md:px-20 lg:px-40 bg-white text-[#111]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#222]">
            Our <span className="text-[#0d9488]">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            At CitiPulse, we offer a suite of civic engagement tools designed to
            make city improvement faster, smarter, and more collaborative.
            Explore how we help citizens and authorities connect for a better
            tomorrow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Issue Reporting",
              desc: "Easily report civic issues like potholes, garbage, water leakage, or broken lights with photos and location data.",
            },
            {
              title: "Live Status Tracking",
              desc: "Track the progress of your complaint in real-time, from submission to resolution, with complete transparency.",
            },
            {
              title: "Geo-Tagging Support",
              desc: "Each report is geo-tagged for precise location mapping, helping authorities quickly identify and act.",
            },
            {
              title: "Government API Integration",
              desc: "We integrate with official systems to ensure that complaints reach the right department without delays.",
            },
            {
              title: "Community Voting",
              desc: "Users can upvote issues they care about, helping prioritize the most critical problems in the city.",
            },
            {
              title: "Awareness Sharing",
              desc: "One-click sharing on social media helps bring public attention to civic issues and creates pressure for action.",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-[#f9f9f9] p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-[#0d9488]">
                {service.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold mb-4 text-[#0d9488]">
            Empowering Citizens, Supporting Governance.
          </h3>
          <p className="text-gray-600">
            CitiPulse is more than a tool — it's your voice in city improvement.
            Use our services and help shape the future of your community.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services;

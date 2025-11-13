"use client";
import React, { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import Header from "../Layouts/Header/Header";
import Footer from "../Layouts/Footer/Footer";
import OtherPosts from "../Posts/OtherPosts/OtherPosts";
import { Landmark, Vote, ShieldCheck, ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    icon: Landmark,
    title: "Instant Issue Reporting",
    desc: "Raise civic issues instantly with geo-tagged images and exact locations.",
  },
  {
    icon: Vote,
    title: "Community-Driven Support",
    desc: "Let your neighborhood vote and amplify local issues together.",
  },
  {
    icon: ShieldCheck,
    title: "Real-Time Government Tracking",
    desc: "Stay informed as government departments respond and resolve reported concerns.",
  },
];

const steps = [
  {
    number: "1",
    title: "Post with Precision",
    desc: "Share civic issues with pinpoint location and visual proof.",
  },
  {
    number: "2",
    title: "Engage Your Community",
    desc: "Encourage local participation through voting and sharing.",
  },
  {
    number: "3",
    title: "Track Resolution",
    desc: "Get live updates as authorities take action.",
  },
];

const testimonials = [
  {
    name: "Ram Gupta",
    quote:
      "Our neighborhood pothole had been ignored for months. Thanks to CitiPulse, it's finally fixed — amazing response!.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Singh",
    quote:
      "Finally, a civic platform that truly delivers! I could track every update from the authorities in real time.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home = () => {
  const { role } = useAuth();
  const isLoggedIn = Boolean(localStorage.getItem("token") || role);

  useEffect(() => {
    console.log("User role:", role);
  }, []);

  return (
    <>
      <Header />
      <main className="bg-white text-gray-800 font-sans">
        {isLoggedIn ? (
          <div className="px-6 md:px-12 py-12">
            <OtherPosts />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="w-full py-24 px-6 md:px-12 text-center bg-gradient-to-br from-blue-50 to-green-50">
              <motion.div
                className="max-w-5xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
                  Empower Your Voice with{" "}
                  <span className="text-blue-600">CitiPulse</span>
                </h1>
                <p className="text-lg md:text-2xl text-gray-700 mb-10">
                  A powerful civic engagement platform to report problems, rally
                  support, and drive real action from local authorities.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to={"/login"}>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg shadow-md hover:bg-blue-700 transition">
                      Get Started
                    </button>
                  </Link>
                  <a
                    href="/developers"
                    className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl text-lg shadow hover:bg-blue-600 hover:text-white transition"
                  >
                    Meet the Developers
                  </a>
                </div>
              </motion.div>
            </section>

            {/* Mission */}
            <section className="py-20 px-6 md:px-12 text-center bg-white">
              <motion.div
                className="max-w-3xl mx-auto"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                  Our Mission
                </h2>
                <p className="text-gray-600 text-lg">
                  CitiPulse is on a mission to bridge the communication gap
                  between citizens and civic authorities. Our platform ensures
                  transparency, accountability, and collective action to build
                  cleaner, safer cities—together.
                </p>
              </motion.div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 md:px-12 bg-gray-50">
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {features.map(({ icon: Icon, title, desc }, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center border border-gray-100"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    <Icon className="mx-auto text-blue-500 mb-4" size={44} />
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Steps */}
            <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-blue-50">
              <div className="text-center mb-16">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-2 text-gray-800"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  How It Works
                </motion.h2>
                <p className="text-gray-600 text-base">
                  A simple and intuitive flow to fix the city—step by step.
                </p>
              </div>
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white rounded-2xl p-8 shadow hover:shadow-lg text-center"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center text-white bg-blue-600 rounded-full font-bold text-xl shadow-lg">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 md:px-12 bg-white">
              <div className="text-center mb-14">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-gray-800"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  What Citizens Are Saying
                </motion.h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {testimonials.map((t, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-blue-50 p-6 rounded-xl shadow flex gap-4 items-start"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-14 h-14 rounded-full border-2 border-blue-500"
                    />
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-1">
                        {t.name}
                      </h4>
                      <p className="italic text-gray-700">“{t.quote}”</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="text-center py-20 px-6 md:px-12 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              <motion.h3
                className="text-3xl font-bold mb-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                Join the Movement. Fix Your City.
              </motion.h3>
              <Link to={"/login"}>
                <button className="bg-white text-blue-600 px-10 py-3 rounded-xl text-lg font-bold shadow hover:bg-gray-100 transition inline-flex items-center gap-2">
                  Get Started <ArrowRightCircle size={20} />
                </button>
              </Link>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Home;

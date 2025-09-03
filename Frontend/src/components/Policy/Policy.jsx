import React from "react";
import Header from "../Layouts/Header/Header";
import Footer from "../Layouts/Footer/Footer";

const Policy = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen px-6 py-12 md:px-20 lg:px-40 bg-white text-[#111]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#222] text-center">
            Privacy <span className="text-[#0d9488]">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed text-center">
            At CitiPulse, we are committed to protecting your privacy. This policy
            outlines how we collect, use, and safeguard your information.
          </p>

          <div className="space-y-10 text-gray-700 text-base leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                1. Information We Collect
              </h2>
              <p>
                We collect personal information such as your name, email, phone
                number, and location when you report issues or sign up. We may
                also collect technical data like device type, IP address, and
                browser information to improve user experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                2. How We Use Your Data
              </h2>
              <p>
                Your data helps us provide accurate issue tracking, communicate
                with you, improve our platform, and work with local authorities
                to resolve problems effectively. We never sell your data to
                third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                3. Data Sharing
              </h2>
              <p>
                We may share your complaint data (like location and image) with
                government authorities for resolution purposes. Your personal
                contact details are not shared publicly without your consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                4. Data Security
              </h2>
              <p>
                We implement strong security practices to protect your
                information. This includes encryption, secure databases, and
                regular system audits. However, no online system is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                5. Your Rights
              </h2>
              <p>
                You have the right to access, update, or delete your personal
                data at any time. Simply reach out to us at&nbsp;
                <a
                  href="mailto:privacy@citiPulse.in"
                  className="text-[#0d9488] underline"
                >
                  privacy@citipulse.in
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                6. Policy Updates
              </h2>
              <p>
                This policy may be updated periodically. When we make changes,
                we’ll notify users through the website or email. Please review
                it regularly to stay informed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                7. Contact Us
              </h2>
              <p>
                If you have any questions or concerns about this policy, feel
                free to contact us at&nbsp;
                <a
                  href="mailto:support@citiPulse.in"
                  className="text-[#0d9488] underline"
                >
                  support@citiPulse.in
                </a>
                .
              </p>
            </section>
          </div>

          <div className="text-center mt-16 text-gray-600">
            <p>Last updated: September, 2025</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Policy;

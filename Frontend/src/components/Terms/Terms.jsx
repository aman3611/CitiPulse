import React from "react";
import Header from "../Layouts/Header/Header";
import Footer from "../Layouts/Footer/Footer";

const Terms = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen px-6 py-12 md:px-20 lg:px-40 bg-white text-[#111]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#222] text-center">
            Terms & <span className="text-[#0d9488]">Conditions</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed text-center">
            These terms govern your access to and use of CitiPulse. By using our
            platform, you agree to abide by the following rules and guidelines.
          </p>

          <div className="space-y-10 text-gray-700 text-base leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using CitiPulse, you agree to comply with and be
                legally bound by these Terms & Conditions. If you do not agree,
                please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                2. User Responsibilities
              </h2>
              <p>
                You agree to use CitiPulse only for lawful purposes. Do not submit
                false, misleading, or abusive reports. You are responsible for
                the accuracy of the information you provide, including issue
                location, images, and description.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                3. Content Ownership
              </h2>
              <p>
                All content submitted by users (text, images, location) remains
                your intellectual property. By submitting content, you grant
                CitiPulse a non-exclusive right to use, display, and share it for
                the purpose of resolving civic issues and improving our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                4. Account Suspension
              </h2>
              <p>
                CitiPulse reserves the right to suspend or terminate user accounts
                that violate these terms, including spamming, misreporting,
                offensive content, or misuse of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                5. Limitation of Liability
              </h2>
              <p>
                CitiPulse is a facilitation platform and does not guarantee
                resolution of every reported issue. We are not liable for
                delays, failures, or actions taken (or not taken) by local
                authorities. Use of our services is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                6. Modifications
              </h2>
              <p>
                We may update these Terms at any time. All changes will be
                posted on this page. Your continued use of the platform after
                changes implies acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                7. Governing Law
              </h2>
              <p>
                These Terms are governed by and construed in accordance with the
                laws of India. Any disputes shall be resolved in the courts of
                jurisdiction in India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0d9488] mb-2">
                8. Contact Information
              </h2>
              <p>
                For any questions about these Terms & Conditions, please contact
                us at&nbsp;
                <a
                  href="mailto:legal@citiPulse.in"
                  className="text-[#0d9488] underline"
                >
                  legal@citiPulse.in
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

export default Terms;

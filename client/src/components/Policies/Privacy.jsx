import React from "react";

const Privacy = () => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Information We Collect</h2>
          <p className="mb-4">
            At ClutchCoins, we collect information you provide directly to us, such as when you create an account, 
            make a purchase, or contact us for support. This includes your name, email address, payment information, 
            and gaming account details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, process transactions, 
            send you technical notices and support messages, and communicate with you about products, services, 
            and promotional offers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Information Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
            except as described in this policy. We may share your information with trusted service providers who assist 
            us in operating our website and conducting our business.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Your Rights</h2>
          <p className="mb-4">
            You have the right to access, update, or delete your personal information. You may also opt out of certain 
            communications from us. To exercise these rights, please contact us using the information provided below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p>Email: privacy@clutchcoins.com</p>
            <p>Address: ClutchCoins Privacy Team</p>
            <p>Response Time: 48-72 hours</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Policy Updates</h2>
          <p>
            This Privacy Policy may be updated from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Privacy;
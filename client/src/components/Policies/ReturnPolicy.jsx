import React from "react";

const ReturnPolicy = () => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Return Policy</h1>
    
    <div className="space-y-6 text-gray-300">
      <section>
        <h2 className="text-xl font-semibold text-cyan-300 mb-3">Digital Products</h2>
        <p className="mb-4">
          All digital game purchases on ClutchCoins are final. Due to the nature of digital products, 
          we cannot offer returns or refunds once a game has been delivered to your account.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-cyan-300 mb-3">Exceptions</h2>
        <p className="mb-4">
          We may consider refunds in the following exceptional circumstances:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Technical issues preventing game download or activation</li>
          <li>Duplicate purchases made in error</li>
          <li>Unauthorized purchases (subject to verification)</li>
          <li>Games that are fundamentally broken or unplayable</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-cyan-300 mb-3">Refund Process</h2>
        <p className="mb-4">
          To request a refund under exceptional circumstances:
        </p>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Contact our support team within 48 hours of purchase</li>
          <li>Provide your order number and detailed reason for the refund request</li>
          <li>Allow 3-5 business days for review and processing</li>
          <li>Refunds will be issued to the original payment method</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-cyan-300 mb-3">ClutchCoins Currency</h2>
        <p className="mb-4">
          ClutchCoins purchased with real money are non-refundable. However, unused ClutchCoins 
          will remain in your account indefinitely and can be used for future purchases.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-cyan-300 mb-3">Contact Information</h2>
        <p className="mb-4">
          For refund requests or questions about this policy, please contact our support team:
        </p>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p>Email: support@clutchcoins.com</p>
          <p>Response Time: 24-48 hours</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-cyan-300 mb-3">Policy Updates</h2>
        <p>
          This return policy may be updated from time to time. Any changes will be posted on this page 
          and will take effect immediately upon posting. Your continued use of ClutchCoins after any 
          changes constitutes acceptance of the new policy.
        </p>
      </section>
    </div>
    </div>
  </div>
);

export default ReturnPolicy;

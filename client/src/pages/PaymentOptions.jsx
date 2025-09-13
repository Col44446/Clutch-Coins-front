import React from "react";
import { CreditCard, Smartphone, Wallet, Shield, Clock, CheckCircle } from "lucide-react";

const PaymentOptions = () => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Payment Options</h1>
      
      <div className="space-y-8 text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Accepted Payment Methods</h2>
          <p className="mb-6">
            ClutchCoins supports multiple secure payment methods to make your gaming currency purchases quick and convenient.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <CreditCard className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Credit & Debit Cards</h3>
              <ul className="text-sm space-y-1">
                <li>• Visa</li>
                <li>• MasterCard</li>
                <li>• American Express</li>
                <li>• Discover</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <Wallet className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Digital Wallets</h3>
              <ul className="text-sm space-y-1">
                <li>• PayPal</li>
                <li>• Google Pay</li>
                <li>• Apple Pay</li>
                <li>• Samsung Pay</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <Smartphone className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Mobile Payments</h3>
              <ul className="text-sm space-y-1">
                <li>• UPI (India)</li>
                <li>• Paytm</li>
                <li>• PhonePe</li>
                <li>• Mobile Banking</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Payment Security</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Bank-Level Security</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                SSL encryption for all transactions
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                PCI DSS compliant payment processing
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Two-factor authentication available
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Fraud detection and prevention
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Processing Times</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <Clock className="w-6 h-6 text-cyan-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Instant Processing</h3>
              <ul className="text-sm space-y-1">
                <li>• Credit/Debit Cards</li>
                <li>• Digital Wallets</li>
                <li>• UPI Payments</li>
              </ul>
              <p className="text-xs text-gray-400 mt-2">Currency delivered within 5 minutes</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Standard Processing</h3>
              <ul className="text-sm space-y-1">
                <li>• Bank Transfers</li>
                <li>• Mobile Banking</li>
              </ul>
              <p className="text-xs text-gray-400 mt-2">Currency delivered within 1-2 hours</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Payment Fees</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="mb-4">
              We believe in transparent pricing with no hidden fees:
            </p>
            <ul className="space-y-2">
              <li>• <strong>Credit/Debit Cards:</strong> No additional fees</li>
              <li>• <strong>Digital Wallets:</strong> No additional fees</li>
              <li>• <strong>UPI/Mobile Payments:</strong> No additional fees</li>
              <li>• <strong>International Cards:</strong> Standard currency conversion rates apply</li>
            </ul>
            <p className="text-sm text-gray-400 mt-4">
              * Some payment providers may charge their own processing fees
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Payment Support</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="mb-4">
              Having trouble with your payment? Our support team is here to help:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Contact Methods</h4>
                <ul className="text-sm space-y-1">
                  <li>Email: payments@clutchcoins.com</li>
                  <li>Live Chat: Available 24/7</li>
                  <li>Phone: +1-800-CLUTCH-1</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Response Times</h4>
                <ul className="text-sm space-y-1">
                  <li>Live Chat: Instant</li>
                  <li>Email: Within 2 hours</li>
                  <li>Phone: Business hours</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default PaymentOptions;

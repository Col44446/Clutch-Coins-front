import React from "react";
import { Truck, Clock, Shield, AlertCircle, CheckCircle, Globe } from "lucide-react";

const DeliveryInfo = () => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Delivery Information</h1>
      <p className="text-gray-300 mb-8 max-w-3xl">
        Learn about our delivery process, timing, and what to expect when you purchase gaming currency from ClutchCoins.
      </p>
      
      <div className="space-y-8">
        {/* Delivery Process */}
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">How Delivery Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Order Processing</h3>
              <p className="text-gray-300 text-sm">
                Your order is automatically processed and verified within seconds of payment confirmation.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Digital Delivery</h3>
              <p className="text-gray-300 text-sm">
                Currency is delivered directly to your game account through secure automated systems.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Confirmation</h3>
              <p className="text-gray-300 text-sm">
                You'll receive email confirmation once the currency has been successfully added to your account.
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Times */}
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Delivery Times</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <Clock className="w-6 h-6 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-3">Standard Delivery</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Most Popular Games:</span>
                  <span className="text-green-400 font-semibold">5-15 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Peak Hours:</span>
                  <span className="text-yellow-400 font-semibold">15-30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">New/Rare Games:</span>
                  <span className="text-orange-400 font-semibold">30-120 minutes</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <Globe className="w-6 h-6 text-cyan-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-3">Regional Variations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Asia-Pacific:</span>
                  <span className="text-green-400 font-semibold">Fastest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">North America:</span>
                  <span className="text-green-400 font-semibold">Fast</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Europe:</span>
                  <span className="text-yellow-400 font-semibold">Standard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Other Regions:</span>
                  <span className="text-orange-400 font-semibold">May vary</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Games */}
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Game-Specific Delivery Info</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Instant Delivery (5-10 min)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• PUBG Mobile</li>
                  <li>• Free Fire</li>
                  <li>• Call of Duty Mobile</li>
                  <li>• Mobile Legends</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Fast Delivery (10-30 min)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Genshin Impact</li>
                  <li>• Roblox</li>
                  <li>• Fortnite</li>
                  <li>• Valorant</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Standard Delivery (30-120 min)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Steam Wallet</li>
                  <li>• PlayStation Store</li>
                  <li>• Xbox Live</li>
                  <li>• Nintendo eShop</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Important Delivery Notes</h2>
          <div className="space-y-4">
            <div className="bg-blue-900/30 border border-blue-500 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Account Information Accuracy</h4>
                  <p className="text-gray-300 text-sm">
                    Ensure your game account ID/username is correct. Incorrect information is the most common cause of delivery delays.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-900/30 border border-yellow-500 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Game Maintenance</h4>
                  <p className="text-gray-300 text-sm">
                    Delivery may be delayed during game maintenance periods or server downtime. We'll process your order as soon as servers are back online.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Delivery Guarantee</h4>
                  <p className="text-gray-300 text-sm">
                    We guarantee delivery of your purchase. If there are any issues, our support team will resolve them quickly or provide a full refund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Your Order */}
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Tracking Your Order</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Order Status Updates</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• <strong>Processing:</strong> Payment confirmed, order being prepared</li>
                  <li>• <strong>In Progress:</strong> Currency being delivered to your account</li>
                  <li>• <strong>Completed:</strong> Currency successfully delivered</li>
                  <li>• <strong>On Hold:</strong> Issue detected, support team notified</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">How to Track</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Check your email for order confirmations</li>
                  <li>• Log into your ClutchCoins account dashboard</li>
                  <li>• Use the order tracking link in your confirmation email</li>
                  <li>• Contact support for real-time updates</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Delivery Issues?</h2>
          <p className="text-gray-300 mb-6">
            If your order hasn't been delivered within the expected timeframe, don't worry! Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-md transition-colors duration-200">
              Contact Support
            </button>
            <a 
              href="mailto:delivery@clutchcoins.com"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition-colors duration-200 inline-block"
            >
              Email Delivery Team
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default DeliveryInfo;

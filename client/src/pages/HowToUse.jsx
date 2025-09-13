import React from "react";
import { Play, ShoppingCart, CreditCard, Download, CheckCircle, ArrowRight } from "lucide-react";

const HowToUse = () => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">How to Use ClutchCoins</h1>
      <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
        Getting your gaming currency is quick and easy! Follow these simple steps to power up your gaming experience.
      </p>
      
      <div className="space-y-12">
        {/* Step-by-step process */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Choose Your Game</h3>
              <p className="text-gray-300 text-sm">
                Browse our extensive game library and select the game you want to purchase currency for.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Select Package</h3>
              <p className="text-gray-300 text-sm">
                Choose the currency package that fits your needs and budget from our available options.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Secure Payment</h3>
              <p className="text-gray-300 text-sm">
                Complete your purchase using our secure payment system with your preferred payment method.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">4. Instant Delivery</h3>
              <p className="text-gray-300 text-sm">
                Your currency is delivered directly to your game account within minutes of purchase.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed instructions */}
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Detailed Instructions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Account Setup</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Create a free ClutchCoins account or log in if you already have one</li>
                    <li>• Verify your email address for account security</li>
                    <li>• Add your gaming account details to your profile for faster checkout</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Game Selection</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Navigate to the "Games" section from the main menu</li>
                    <li>• Use the search function or browse categories to find your game</li>
                    <li>• Click on your game to view available currency packages</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Package Selection & Account Details</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Choose the currency amount that suits your needs</li>
                    <li>• Enter your game account ID/username accurately</li>
                    <li>• Double-check all details before proceeding to payment</li>
                    <li>• Review the total cost including any applicable taxes</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Payment Process</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Select your preferred payment method</li>
                    <li>• Enter payment details in our secure checkout form</li>
                    <li>• Review your order summary one final time</li>
                    <li>• Complete the payment to process your order</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">5</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Order Completion</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Receive order confirmation via email</li>
                    <li>• Track your order status in your account dashboard</li>
                    <li>• Currency will be delivered to your game account within 5-15 minutes</li>
                    <li>• Check your game account to confirm receipt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important tips */}
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Important Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Best Practices</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Always double-check your game account ID</li>
                <li>• Keep your account credentials secure</li>
                <li>• Save order confirmation emails</li>
                <li>• Contact support if delivery takes longer than expected</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <ArrowRight className="w-6 h-6 text-yellow-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Common Issues</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Incorrect account ID is the most common delay cause</li>
                <li>• Some games may have maintenance periods affecting delivery</li>
                <li>• Payment verification may take a few minutes</li>
                <li>• Contact support for any delivery issues</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Support section */}
        <section className="bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Need Help?</h2>
          <p className="text-gray-300 mb-6">
            Our support team is available 24/7 to assist you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-md transition-colors duration-200">
              Start Live Chat
            </button>
            <a 
              href="mailto:support@clutchcoins.com"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition-colors duration-200 inline-block"
            >
              Email Support
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default HowToUse;

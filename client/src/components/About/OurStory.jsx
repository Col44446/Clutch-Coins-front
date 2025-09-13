import React from "react";
import PropTypes from 'prop-types';

const OurStory = () => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Our Story</h1>
      
      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">The Beginning</h2>
          <p className="mb-4">
            ClutchCoins was born from a simple idea: making gaming more accessible and rewarding for everyone. 
            Founded by passionate gamers who understood the frustration of grinding for hours to earn in-game currency, 
            we set out to create a platform that would revolutionize how players interact with their favorite games.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Our Mission</h2>
          <p className="mb-4">
            We believe that gaming should be about fun, strategy, and skill – not endless grinding. Our mission is to 
            provide a secure, reliable platform where gamers can focus on what they love most: playing and enjoying games. 
            Whether you're a casual player looking to enhance your experience or a competitive gamer seeking that edge, 
            ClutchCoins is here to support your gaming journey.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">What We Do</h2>
          <p className="mb-4">
            ClutchCoins specializes in providing legitimate, secure in-game currency for popular video games. 
            We work directly with trusted suppliers and maintain strict quality standards to ensure every transaction 
            is safe, fast, and reliable. Our platform supports multiple games and payment methods, making it easy 
            for players worldwide to get the resources they need.
          </p>
          
          <div className="bg-gray-800 p-6 rounded-lg mt-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">Key Features</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Instant delivery of in-game currency</li>
              <li>24/7 customer support</li>
              <li>Secure payment processing</li>
              <li>Competitive pricing</li>
              <li>Multi-game platform support</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">Security First</h3>
              <p>
                Your account safety and personal information protection are our top priorities. 
                We use industry-standard encryption and security measures.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">Fair Play</h3>
              <p>
                We support legitimate gaming practices and work only with authorized currency sources 
                to maintain game integrity.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">Customer Focus</h3>
              <p>
                Every decision we make is centered around improving your gaming experience and 
                providing exceptional service.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">Innovation</h3>
              <p>
                We continuously evolve our platform with new features, games, and services 
                to meet the changing needs of the gaming community.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Looking Forward</h2>
          <p className="mb-4">
            As the gaming industry continues to evolve, so do we. We're constantly expanding our game library, 
            improving our services, and exploring new ways to enhance the gaming experience. Our goal is to become 
            the most trusted name in gaming currency, helping millions of players worldwide achieve their gaming goals.
          </p>
          
          <p className="mb-4">
            Join us on this journey and discover why thousands of gamers trust ClutchCoins for their gaming needs. 
            Whether you're just starting out or you're a seasoned veteran, we're here to help you clutch those 
            crucial moments and dominate your favorite games.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Get in Touch</h2>
          <p className="mb-4">
            Have questions about our story or want to learn more about what we do? We'd love to hear from you.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p>Email: hello@clutchcoins.com</p>
            <p>Support: support@clutchcoins.com</p>
            <p>Follow us on social media for the latest updates and gaming news!</p>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default OurStory;

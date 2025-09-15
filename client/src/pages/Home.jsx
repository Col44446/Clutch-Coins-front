import React from 'react'
import MainCard from "../components/Home/mainCard"
import Offers from '../components/Home/Offers'
import PopularGames from '../components/Home/PopularGame'
import lightningIcon from '../assets/temp-25.png';
import treasureIcon from '../assets/temp-26.png';
import shieldIcon from '../assets/temp-27.png';
import GameCard from '../components/Home/moreGame';
import PaymentSlider from '../components/Home/paymentSlider';
export const Home = () => {
  return (
    <div className="min-h-screen pt-3   ">
      <MainCard />
      <Offers />
      <PopularGames />
      <section
        className="bg-gray-800 py-6 px-4"
        aria-label="Platform Features"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-8">
            {/* Feature 1 */}
            <article className="flex items-center text-white p-4 bg-gray-700/50 hover:bg-gray-700/70 transition duration-300 rounded-lg">
              <img src={lightningIcon} alt="Lightning fast delivery" className="w-10 h-10 mr-4" />
              <div>
                <h3 className="font-semibold text-base">Lightning Fast</h3>
                <p className="text-sm text-gray-300">Instant delivery guaranteed</p>
              </div>
            </article>

            {/* Feature 2 */}
            <article className="flex items-center text-white p-4 bg-gray-700/50 hover:bg-gray-700/70 transition duration-300 rounded-lg">
              <img src={treasureIcon} alt="Best value deals" className="w-10 h-10 mr-4" />
              <div>
                <h3 className="font-semibold text-base">Best Value</h3>
                <p className="text-sm text-gray-300">Competitive prices always</p>
              </div>
            </article>

            {/* Feature 3 */}
            <article className="flex items-center text-white p-4 bg-gray-700/50 hover:bg-gray-700/70 transition duration-300 rounded-lg">
              <img src={shieldIcon} alt="Secure transactions" className="w-10 h-10 mr-4" />
              <div>
                <h3 className="font-semibold text-base">100% Secure</h3>
                <p className="text-sm text-gray-300">Safe & trusted platform</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <GameCard />
      <PaymentSlider />
    </div>
  )
}

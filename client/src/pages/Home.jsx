import React from 'react'
import MainCard from "../components/Home/mainCard"
import PopularGames from '../components/Home/PopularGame'
import lightningIcon from '../assets/temp-25.png';
import treasureIcon from '../assets/temp-26.png';
import shieldIcon from '../assets/temp-27.png';
import GameCard from '../components/Home/moreGame';
import PaymentSlider from '../components/Home/paymentSlider';

const Home = () => {
  return (
    <div>
      <MainCard />
      <PopularGames />
      <section
        className="bg-gray-800 p-4 sm:p-6 md:p-8"
        aria-label="Platform Features"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-around items-center gap-4 sm:gap-6 md:gap-8">

          {/* Feature 1 */}
          <article className="flex items-center text-white p-3 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 transition duration-300 rounded-lg w-full sm:w-auto">
            <img
              src={lightningIcon}
              alt="Lightning fast reload icon"
              className="mr-3 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              loading="lazy"
            />
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Lightning-Fast Reload</h3>
              <p className="text-xs sm:text-sm">Instant top-up for non-stop action!</p>
            </div>
          </article>

          {/* Feature 2 */}
          <article className="flex items-center text-white p-3 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 transition duration-300 rounded-lg w-full sm:w-auto">
            <img
              src={treasureIcon}
              alt="Treasure chest rewards icon"
              className="mr-3 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              loading="lazy"
            />
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Epic Rewards Unleashed</h3>
              <p className="text-xs sm:text-sm">Exclusive bonuses to supercharge your game!</p>
            </div>
          </article>

          {/* Feature 3 */}
          <article className="flex items-center text-white p-3 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 transition duration-300 rounded-lg w-full sm:w-auto">
            <img
              src={shieldIcon}
              alt="Secure payment shield icon"
              className="mr-3 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              loading="lazy"
            />
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Fortress of Trust</h3>
              <p className="text-xs sm:text-sm">Secure payments, always!</p>
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

export default Home;

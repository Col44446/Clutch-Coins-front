import React from "react";
import { Link } from "react-router-dom";
import pic1 from '../../assets/temp-1.png';
import pic2 from '../../assets/temp-2.jpg';
import pic3 from '../../assets/temp-3.png';

const offersData = [
  {
    id: 1,
    title: "Battlegrounds Mobile India",
    company: "KRAFTON India",
    discount: 16,
    price: 75,
    oldPrice: 89,
    savings: 14,
    image: pic1,
  },
  {
    id: 2,
    title: "Valorant - Riot Cash",
    company: "Riot Games Services Pte. Ltd.",
    discount: 1,
    price: 410,
    oldPrice: 415,
    savings: 5,
    image: pic2,
  },
  {
    id: 3,
    title: "Roblox - Get 25% extra",
    company: "Roblox",
    discount: 17,
    price: 906,
    oldPrice: 1087,
    savings: 181,
    image: pic3,
  },
];

function Offers() {
  return (
    <section
      className="bg-gradient-to-br from-gray-900 via-slate-950 to-blue-950 p-3 sm:p-4 rounded-xl shadow-xl"
      aria-labelledby="offers-title"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2 px-2">
        <h2
          id="offers-title"
          className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md"
        >
          Top Deals
        </h2>
        <Link
          to="/games"
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 
          text-white text-xs sm:text-sm font-semibold rounded-full shadow-md 
          hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:scale-105 
          transform transition-all duration-300 ease-in-out focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          aria-label="Explore more deals"
        >
          Discover More →
        </Link>
      </div>

      {/* Cards */}
      <div className="flex sm:grid sm:grid-cols-3 gap-2 sm:gap-3 overflow-x-auto sm:overflow-x-hidden scrollbar-hide snap-x snap-mandatory px-2">
        {offersData.map((offer) => (
          <article
            key={offer.id}
            className="min-w-[130px] sm:min-w-0 bg-indigo-950/40 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-white/5 flex items-center p-2 snap-center"
            aria-labelledby={`offer-${offer.id}-title`}
          >
            {/* Image */}
            <div className="relative flex-shrink-0">
              <img
                src={offer.image}
                alt={`${offer.title} by ${offer.company}`}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-white/10"
                loading="lazy"
              />
              <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[7px] sm:text-[8px] font-bold px-1 py-0.5 rounded-full">
                {offer.discount}%
              </span>
            </div>

            {/* Info */}
            <div className="ml-2 flex-1">
              <h3
                id={`offer-${offer.id}-title`}
                className="text-[12px] sm:text-[13px] font-semibold text-white leading-tight line-clamp-2"
              >
                {offer.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">{offer.company}</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-[10px] sm:text-[11px] font-bold text-white">
                  ₹{offer.price.toFixed(2)}
                </span>
                <span className="text-gray-500 line-through text-[9px] sm:text-[10px]">
                  ₹{offer.oldPrice.toFixed(2)}
                </span>
              </div>
              <div className="mt-0.5 text-[9px] sm:text-[10px] font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 px-1 py-0.5 rounded w-fit">
                Save ₹{offer.savings.toFixed(2)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Offers;
import React, { useRef } from "react";
import pic1 from '../../assets/temp-18.png';
import pic2 from '../../assets/temp-19.png';
import pic3 from '../../assets/temp-20.png';
import pic4 from '../../assets/temp-21.png';
import pic5 from '../../assets/temp-22.png';
import pic6 from '../../assets/temp-23.png';
import pic7 from '../../assets/temp-24.png';

const popularGamesData = [
    {
        id: 1,
        name: "BGMI",
        description: "An immersive battle royale experience with intense multiplayer action and stunning graphics.",
        image: pic1,
    },
    {
        id: 2,
        name: "Valorant",
        description: "A tactical shooter game combining precise gunplay with unique agent abilities for strategic team play.",
        image: pic2,
    },
    {
        id: 3,
        name: "Roblox",
        description: "A user-generated platform where you can create, share, and play games with millions worldwide.",
        image: pic3,
    },
    {
        id: 4,
        name: "BGMI",
        description: "An immersive battle royale experience with intense multiplayer action and stunning graphics.",
        image: pic4,
    },
    {
        id: 5,
        name: "Valorant",
        description: "A tactical shooter game combining precise gunplay with unique agent abilities for strategic team play.",
        image: pic5,
    },
    {
        id: 6,
        name: "Roblox",
        description: "A user-generated platform where you can create, share, and play games with millions worldwide.",
        image: pic6,
    },
    {
        id: 7,
        name: "Roblox",
        description: "A user-generated platform where you can create, share, and play games with millions worldwide.",
        image: pic7,
    },
];

function PopularGames() {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <section
            className="bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 p-6 rounded-xl shadow-lg"
            aria-labelledby="popular-games-title"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2
                    id="popular-games-title"
                    className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                >
                    Trending Games
                </h2>
                <a
                    href="/games"
                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-full shadow-md hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                    aria-label="Explore more trending games"
                >
                    Explore →
                </a>
            </div>

            {/* Cards Row with Arrows */}
            <div className="relative">
                {/* Left Arrow (Desktop Only) */}
                <button
                    onClick={scrollLeft}
                    className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 z-30"
                    aria-label="Scroll left"
                >
                    &lt;
                </button>

                {/* Cards Container */}
                <div
                    ref={scrollRef}
                    className="flex flex-row gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                >
                    {popularGamesData.map((game) => (
                        <article
                            key={game.id}
                            className="min-w-[140px] sm:min-w-[160px] bg-indigo-950/60 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group relative snap-start"
                        >
                            {/* Blue Gradient Light Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                            {/* Image */}
                            <div className="relative h-48 sm:h-56">
                                <img
                                    src={game.image}
                                    alt={`${game.name} - ${game.description}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Description Overlay */}
                                <div className="absolute inset-0 bg-black/80 text-white p-3 text-[11px] sm:text-xs opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-in-out flex items-center justify-center text-center z-20">
                                    {game.description}
                                </div>

                                {/* Top Up Button */}
                                <div className="absolute mb-7 bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 z-30 transition-all duration-500">
                                    <button className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                                        Top Up
                                    </button>
                                </div>

                                {/* Game Name */}
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white text-center py-2 px-2 z-20">
                                    <h3 className="text-sm font-semibold drop-shadow-lg line-clamp-1">
                                        {game.name}
                                    </h3>
                                    <p className="text-xs text-gray-300 mt-1 line-clamp-1 leading-tight">
                                        {game.description}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Right Arrow (Desktop Only) */}
                <button
                    onClick={scrollRight}
                    className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 z-30"
                    aria-label="Scroll right"
                >
                    &gt;
                </button>
            </div>
        </section>
    );
}

export default PopularGames;
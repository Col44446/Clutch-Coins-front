import React from 'react';
import game1 from '../../assets/temp-28.jpg'; // Adjust paths based on your project
import game2 from '../../assets/temp-29.jpg';
import game3 from '../../assets/temp-30.jpg';
import game4 from '../../assets/temp-31.jpg';
import game5 from '../../assets/temp-32.jpg';
import game6 from '../../assets/temp-33.jpg';

const games = [
    {
        title: 'Battlegrounds Mobile India',
        image: game1,
    },
    {
        title: 'CyberSmith’s Arena',
        image: game2,
    },
    {
        title: 'Mystic Quest',
        image: game3,
    },
    {
        title: 'Star Racer',
        image: game4,
    },
    {
        title: 'Shadow Tactics',
        image: game5,
    },
    {
        title: 'Pixel Legends',
        image: game6,
    },
];

const GameCard = () => {
    return (
        <section className="bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950 py-8 px-6 relative overflow-hidden">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6">
                More Games
            </h1>
            <div className='bg-gray-900 p-6 rounded-xl'>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
                    {games.map((game, index) => (
                        <article
                            key={index}
                            className="bg-indigo-950/60 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group relative"
                        >
                            {/* Image */}
                            <div className="relative h-40 sm:h-48">
                                <img
                                    src={game.image}
                                    alt={`${game.title} game cover`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Title overlay */}
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white text-center py-2 px-2">
                                    <h2 className="text-sm font-semibold line-clamp-1">
                                        {game.title}
                                    </h2>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-800 text-white font-medium text-sm rounded-full shadow-lg hover:from-cyan-500 hover:to-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        View More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default GameCard;
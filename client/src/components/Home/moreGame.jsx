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
        <section className="bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950 min-h-screen flex flex-col items-start justify-center p-6 relative overflow-hidden">
            <h1 className="m-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                More Games
            </h1>
            <div className='bg-gray-900 p-4 m-2 rounded-2xl'>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
                    {games.map((game, index) => (
                        <article
                            key={index}
                            className="rounded-xl overflow-hidden"
                        >
                            {/* Image with border */}
                            <div className="border-2 border-cyan-600/50 hover:border-cyan-300 transition-colors duration-300 rounded-xl overflow-hidden">
                                <img
                                    src={game.image}
                                    alt={`${game.title} game cover`}
                                    className="w-full h-58 object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Title below the image */}
                            <div className="p-2 text-center">
                                <h2 className="text-md font-bold text-white line-clamp-1">
                                    {game.title}
                                </h2>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-6 text-center w-full max-w-7xl mx-auto">
                    <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-800 text-white font-bold text-md rounded-full shadow-[0_0_5px_rgba(0,255,255,0.5)] hover:bg-gradient-to-r hover:from-cyan-900 hover:to-blue-500 transition-colors duration-300">
                        VIew more
                    </button>
                </div>
            </div>
        </section>
    );
};

export default GameCard;
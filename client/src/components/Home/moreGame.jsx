import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import game1 from '../../assets/temp-28.jpg'; // Adjust paths based on your project
import game2 from '../../assets/temp-29.jpg';
import game3 from '../../assets/temp-30.jpg';
import game4 from '../../assets/temp-31.jpg';
import game5 from '../../assets/temp-32.jpg';
import game6 from '../../assets/temp-33.jpg';
// Additional placeholder images for new rows
import game7 from '../../assets/temp-11.jpg';
import game8 from '../../assets/temp-12.jpg';
import game9 from '../../assets/temp-13.jpg';
import game10 from '../../assets/temp-14.jpg';
import game11 from '../../assets/temp-15.jpg';
import game12 from '../../assets/temp-16.jpg';
import game13 from '../../assets/temp-17.jpg';
import game14 from '../../assets/temp-18.png';
import game15 from '../../assets/temp-19.png';
import game16 from '../../assets/temp-20.png';
import game17 from '../../assets/temp-21.png';
import game18 from '../../assets/temp-22.png';

const games = [
    {
        id: 'warrior-quest',
        title: 'Warrior Quest',
        image: game14,
    },
    {
        id: 'elite-shooter',
        title: 'Elite Shooter',
        image: game16,
    },
    {
        id: 'battlegrounds-mobile',
        title: 'Battlegrounds Mobile',
        image: game1,
    },
    {
        id: 'valorant-tactical',
        title: 'Valorant',
        image: game9,
    },
    {
        id: 'roblox-platform',
        title: 'Roblox',
        image: game5,
    },
    {
        id: 'minecraft-sandbox',
        title: 'Minecraft',
        image: game6,
    },
    {
        id: 'cod-mobile',
        title: 'Call of Duty Mobile',
        image: game10,
    },
    {
        id: 'speed-racing',
        title: 'Speed Racing',
        image: game8,
    },
    {
        id: 'adventure-world',
        title: 'Adventure World',
        image: game7,
    },
    {
        id: 'puzzle-master',
        title: 'Puzzle Master',
        image: game17,
    },
    {
        id: 'strategy-empire',
        title: 'Strategy Empire',
        image: game11,
    },
    {
        id: 'fantasy-rpg',
        title: 'Fantasy RPG',
        image: game15,
    },
    {
        id: 'sports-champions',
        title: 'Sports Champions',
        image: game12,
    },
    {
        id: 'action-hero',
        title: 'Action Hero',
        image: game13,
    },
    {
        id: 'life-simulator',
        title: 'Life Simulator',
        image: game3,
    },
    {
        id: 'horror-nights',
        title: 'Horror Nights',
        image: game4,
    },
    {
        id: 'survival-island',
        title: 'Survival Island',
        image: game18,
    },
];

const GameCard = () => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    const displayedGames = showAll ? games : games.slice(0, 4);

    return (
        <section className="bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950 min-h-screen flex flex-col items-start justify-center container-responsive p-responsive relative overflow-hidden">
            <h1 className="text-responsive-2xl font-extrabold text-white tracking-tight drop-shadow-md mb-6">
                Games For You
            </h1>
            <div className='bg-gray-900 p-responsive rounded-2xl w-full'>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-responsive max-w-7xl mx-auto">
                    {displayedGames.map((game, index) => (
                        <article
                            key={index}
                            className="rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
                            onClick={() => handleGameClick(game.id)}
                        >
                            {/* Image with border */}
                            <div className="border-2 border-cyan-600/50 hover:border-cyan-300 transition-colors duration-300 rounded-xl overflow-hidden touch-manipulation">
                                <img
                                    src={game.image}
                                    alt={`${game.title} game cover`}
                                    className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                />
                            </div>

                            {/* Title below the image */}
                            <div className="p-2 text-center">
                                <h2 className="text-responsive-sm font-bold text-white line-clamp-1">
                                    {game.title}
                                </h2>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-6 text-center w-full max-w-7xl mx-auto">
                    <button 
                        onClick={() => setShowAll(!showAll)}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-800 text-white font-bold text-responsive-sm rounded-full shadow-[0_0_5px_rgba(0,255,255,0.5)] hover:bg-gradient-to-r hover:from-cyan-900 hover:to-blue-500 transition-colors duration-300 touch-manipulation min-h-[44px]"
                    >
                        {showAll ? 'Show Less' : 'View More'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default GameCard;
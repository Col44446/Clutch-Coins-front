import React, { useState, useEffect } from 'react';
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
    const [visibleGames, setVisibleGames] = useState(4);

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    // Dynamic game count based on screen size
    useEffect(() => {
        const updateVisibleGames = () => {
            const width = window.innerWidth;
            if (width >= 1280) { // xl
                setVisibleGames(showAll ? games.length : 12);
            } else if (width >= 1024) { // lg
                setVisibleGames(showAll ? games.length : 10);
            } else if (width >= 768) { // md
                setVisibleGames(showAll ? games.length : 8);
            } else if (width >= 640) { // sm
                setVisibleGames(showAll ? games.length : 6);
            } else { // mobile
                setVisibleGames(showAll ? games.length : 4);
            }
        };

        updateVisibleGames();
        window.addEventListener('resize', updateVisibleGames);
        return () => window.removeEventListener('resize', updateVisibleGames);
    }, [showAll]);

    const displayedGames = games.slice(0, visibleGames);

    return (
        <section className="bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950 min-h-screen flex flex-col items-start justify-center container-responsive p-responsive relative overflow-hidden">
            <h1 className="text-responsive-2xl font-extrabold text-white tracking-tight drop-shadow-md mb-6">
                Games For You
            </h1>
            <div className='bg-gray-900 p-responsive rounded-2xl w-full'>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
                    {displayedGames.map((game, index) => (
                        <article
                            key={index}
                            className="min-w-[160px] sm:min-w-[200px] bg-indigo-950/60 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 overflow-hidden group relative cursor-pointer"
                            onClick={() => handleGameClick(game.id)}
                        >
                            {/* Blue Gradient Light Effect (Always over image) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-blue-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-10"></div>

                            {/* Image */}
                            <div className="relative h-56 sm:h-78">
                                <img
                                    src={game.image}
                                    alt={`${game.title} game cover`}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                    style={{ aspectRatio: '9/16' }}
                                    loading="lazy"
                                />

                                {/* Top Up Button */}
                                <div className="absolute mb-7 bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 z-30 transition-all duration-500">
                                    <button className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                                        Top Up
                                    </button>
                                </div>

                                {/* Game Name */}
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent text-white text-center py-2 text-xs sm:text-sm font-bold drop-shadow-sm z-20">
                                    {game.title}
                                </div>
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
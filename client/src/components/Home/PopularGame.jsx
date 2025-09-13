import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import pic1 from '../../assets/temp-18.png';
import pic2 from '../../assets/temp-19.png';
import pic3 from '../../assets/temp-20.png';
import pic4 from '../../assets/temp-21.png';
import pic5 from '../../assets/temp-22.png';
import pic6 from '../../assets/temp-23.png';
import pic7 from '../../assets/temp-24.png';
import pic8 from '../../assets/temp-28.jpg';
import pic9 from '../../assets/temp-29.jpg';
import pic10 from '../../assets/temp-30.jpg';
import pic11 from '../../assets/temp-31.jpg';
import pic12 from '../../assets/temp-32.jpg';
import pic13 from '../../assets/temp-11.jpg';
import pic14 from '../../assets/temp-12.jpg';
import pic15 from '../../assets/temp-13.jpg';
import pic16 from '../../assets/temp-14.jpg';

const popularGamesData = [
    {
        id: 'warrior-quest',
        name: "Warrior Quest",
        description: "An immersive battle royale experience with intense multiplayer action and stunning graphics.",
        image: pic1,
    },
    {
        id: 'elite-shooter',
        name: "Elite Shooter",
        description: "A tactical shooter game combining precise gunplay with unique agent abilities for strategic team play.",
        image: pic2,
    },
    {
        id: 'battlegrounds-mobile',
        name: "Battlegrounds Mobile",
        description: "A user-generated platform where you can create, share, and play games with millions worldwide.",
        image: pic3,
    },
    {
        id: 'valorant-tactical',
        name: "Valorant",
        description: "An immersive battle royale experience with intense multiplayer action and stunning graphics.",
        image: pic4,
    },
    {
        id: 'roblox-platform',
        name: "Roblox",
        description: "Create, share, and play games with millions worldwide in this endless gaming universe.",
        image: pic10,
    },
    {
        id: 'minecraft-sandbox',
        name: "Minecraft",
        description: "Build, explore, and survive in randomly generated worlds with unlimited creativity.",
        image: pic11,
    },
    {
        id: 'cod-mobile',
        name: "Call of Duty Mobile",
        description: "Experience the thrill of the world's most beloved shooter game on your mobile device.",
        image: pic12,
    },
    {
        id: 'speed-racing',
        name: "Speed Racing",
        description: "Feel the adrenaline rush in the ultimate racing experience with supercars.",
        image: pic13,
    },
    {
        id: 'adventure-world',
        name: "Adventure World",
        description: "Embark on an epic journey through mystical realms filled with ancient secrets.",
        image: pic14,
    },
    {
        id: 'puzzle-master',
        name: "Puzzle Master",
        description: "Challenge your mind with hundreds of brain-teasing puzzles and logic games.",
        image: pic15,
    },
    {
        id: 'strategy-empire',
        name: "Strategy Empire",
        description: "Build your civilization from the ground up in this epic real-time strategy game.",
        image: pic16,
    },
    {
        id: 'horror-nights',
        name: "Horror Nights",
        description: "Experience spine-chilling horror in this terrifying survival game.",
        image: pic5,
    },
    {
        id: 'survival-island',
        name: "Survival Island",
        description: "Stranded on a mysterious island, use your wits and skills to survive.",
        image: pic6,
    },
    {
        id: 'fantasy-rpg',
        name: "Fantasy RPG",
        description: "Enter a world of magic and adventure in this immersive role-playing experience.",
        image: pic7,
    },
    {
        id: 'life-simulator',
        name: "Life Simulator",
        description: "Live a virtual life from birth to old age and create your own unique story.",
        image: pic8,
    },
    {
        id: 'action-hero',
        name: "Action Hero",
        description: "Become the ultimate action hero and save the world from destruction.",
        image: pic9,
    },
];

function PopularGames() {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.children[0]?.offsetWidth || 200;
            const gap = 16; // 1rem gap
            const scrollAmount = (cardWidth + gap) * 4; // Scroll 4 cards at a time
            scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.children[0]?.offsetWidth || 200;
            const gap = 16; // 1rem gap
            const scrollAmount = (cardWidth + gap) * 4; // Scroll 4 cards at a time
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section
            className="bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 p-4 rounded-2xl shadow-4xl"
            aria-labelledby="popular-games-title"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2
                    id="popular-games-title"
                    className="m-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md"
                >
                    Trending Games
                </h2>
                <a
                    href="/game"
                    className="px-4 py-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-800 text-white text-sm font-semibold rounded-full shadow-md hover:from-cyan-300 hover:via-blue-400 hover:to-blue-500 hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out"
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
                    className="flex flex-row gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x px-8 md:px-12"
                    style={{
                        scrollSnapType: 'x mandatory',
                        scrollBehavior: 'smooth'
                    }}
                    onWheel={(e) => {
                        e.preventDefault();
                        scrollRef.current.scrollLeft += e.deltaY;
                    }}
                >
                    {popularGamesData.map((game) => (
                        <article
                            key={game.id}
                            className="min-w-[160px] sm:min-w-[200px] bg-indigo-950/60 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 overflow-hidden group relative snap-start cursor-pointer flex-shrink-0"
                            onClick={() => handleGameClick(game.id)}
                        >
                            {/* Blue Gradient Light Effect (Always over image) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-blue-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-10"></div>

                            {/* Image */}
                            <div className="relative h-56 sm:h-78">
                                <img
                                    src={game.image}
                                    alt={`${game.name} - ${game.description}`}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                    style={{ aspectRatio: '9/16' }}
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
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent text-white text-center py-2 text-xs sm:text-sm font-bold drop-shadow-sm z-20">
                                    {game.name}
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
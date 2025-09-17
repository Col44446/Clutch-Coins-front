import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import SEOHead from '../common/SEOHead';
import { 
  FaGlobe, 
  FaBolt, 
  FaShieldAlt, 
  FaDollarSign, 
  FaChevronDown, 
  FaChevronUp,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShoppingCart
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Static game data for placeholder games
const staticGames = {
  'warrior-quest': {
    title: 'Warrior Quest',
    publisher: 'Epic Games Studio',
    description: 'Embark on an epic adventure in Warrior Quest, where you play as a legendary warrior fighting through mystical lands filled with dangerous creatures and ancient treasures. Master various combat skills, collect powerful weapons, and uncover the secrets of the ancient world.',
    image: '/src/assets/temp-18.png',
    offers: [
      { key: 'Welcome Bonus', value: 'Get 500 free coins on first purchase' },
      { key: 'Daily Rewards', value: 'Login daily to claim exclusive rewards' },
      { key: 'Battle Pass', value: 'Unlock premium content with season pass' }
    ],
    currencies: [
      { name: '100 Gold Coins', amount: 4.99 },
      { name: '500 Gold Coins', amount: 19.99 },
      { name: '1000 Gold Coins', amount: 34.99 },
      { name: '2500 Gold Coins', amount: 79.99 }
    ]
  },
  'elite-shooter': {
    title: 'Elite Shooter',
    publisher: 'Combat Studios',
    description: 'Experience intense tactical combat in Elite Shooter, a premium first-person shooter that combines realistic graphics with strategic gameplay. Choose from multiple game modes, customize your weapons, and compete against players worldwide in ranked matches.',
    image: '/src/assets/temp-19.png',
    offers: [
      { key: 'Weapon Pack', value: 'Unlock 5 exclusive weapons instantly' },
      { key: 'XP Boost', value: 'Double XP for 7 days' },
      { key: 'Elite Skin', value: 'Premium character customization options' }
    ],
    currencies: [
      { name: '200 Battle Points', amount: 9.99 },
      { name: '600 Battle Points', amount: 24.99 },
      { name: '1500 Battle Points', amount: 49.99 },
      { name: '3500 Battle Points', amount: 99.99 }
    ]
  },
  'battlegrounds-mobile': {
    title: 'Battlegrounds Mobile India',
    publisher: 'Krafton',
    description: 'The ultimate battle royale experience on mobile. Drop into intense 100-player matches, scavenge for weapons and supplies, and fight to be the last one standing. Features multiple maps, vehicles, and constant updates with new content.',
    image: '/src/assets/temp-28.jpg',
    offers: [
      { key: 'Royal Pass', value: 'Unlock exclusive rewards and missions' },
      { key: 'UC Bonus', value: 'Extra UC coins with every purchase' },
      { key: 'Crate Keys', value: 'Open premium weapon and outfit crates' }
    ],
    currencies: [
      { name: '60 UC', amount: 0.99 },
      { name: '325 UC', amount: 4.99 },
      { name: '660 UC', amount: 9.99 },
      { name: '1800 UC', amount: 24.99 }
    ]
  },
  'valorant-tactical': {
    title: 'Valorant',
    publisher: 'Riot Games',
    description: 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities. Create opportunities to take the shot. Risk everything to save the world. Outsmart, outplay, and outshoot everyone in your way.',
    image: '/src/assets/temp-29.jpg',
    offers: [
      { key: 'Battle Pass', value: 'Unlock exclusive skins and rewards' },
      { key: 'Radianite Points', value: 'Upgrade your weapon skins' },
      { key: 'Agent Contract', value: 'Unlock new agents faster' }
    ],
    currencies: [
      { name: '475 VP', amount: 4.99 },
      { name: '1000 VP', amount: 9.99 },
      { name: '2050 VP', amount: 19.99 },
      { name: '3650 VP', amount: 34.99 }
    ]
  },
  'roblox-platform': {
    title: 'Roblox',
    publisher: 'Roblox Corporation',
    description: 'A user-generated platform where you can create, share, and play games with millions worldwide. Explore countless worlds, customize your avatar, and unleash your creativity in this endless gaming universe.',
    image: '/src/assets/temp-30.jpg',
    offers: [
      { key: 'Premium Membership', value: 'Monthly Robux allowance and exclusive items' },
      { key: 'Avatar Shop', value: 'Access to premium clothing and accessories' },
      { key: 'Game Pass', value: 'Special abilities in supported games' }
    ],
    currencies: [
      { name: '80 Robux', amount: 0.99 },
      { name: '400 Robux', amount: 4.99 },
      { name: '800 Robux', amount: 9.99 },
      { name: '1700 Robux', amount: 19.99 }
    ]
  },
  'minecraft-sandbox': {
    title: 'Minecraft',
    publisher: 'Mojang Studios',
    description: 'Build, explore, and survive in randomly generated worlds. From simple homes to grand castles, bring your imagination to life one block at a time in this sandbox adventure game.',
    image: '/src/assets/temp-31.jpg',
    offers: [
      { key: 'Minecoins', value: 'Purchase skins, texture packs, and worlds' },
      { key: 'Realms Plus', value: 'Private server with exclusive content' },
      { key: 'Marketplace', value: 'Access to community creations' }
    ],
    currencies: [
      { name: '320 Minecoins', amount: 1.99 },
      { name: '1020 Minecoins', amount: 4.99 },
      { name: '1720 Minecoins', amount: 9.99 },
      { name: '3500 Minecoins', amount: 19.99 }
    ]
  },
  'cod-mobile': {
    title: 'Call of Duty Mobile',
    publisher: 'Activision',
    description: 'Experience the thrill of the world\'s most beloved shooter game, now on your mobile device. Engage in intense multiplayer combat, battle royale matches, and iconic game modes.',
    image: '/src/assets/temp-32.jpg',
    offers: [
      { key: 'Battle Pass', value: 'Unlock exclusive weapons and skins' },
      { key: 'CP Bonus', value: 'Extra COD Points with every purchase' },
      { key: 'Lucky Draw', value: 'Chance to win legendary items' }
    ],
    currencies: [
      { name: '80 CP', amount: 0.99 },
      { name: '400 CP', amount: 4.99 },
      { name: '800 CP', amount: 9.99 },
      { name: '2000 CP', amount: 24.99 }
    ]
  },
  'speed-racing': {
    title: 'Speed Racing',
    publisher: 'Velocity Studios',
    description: 'Feel the adrenaline rush in the ultimate racing experience. Customize your dream cars, compete in championships, and dominate the streets in this high-octane racing game.',
    image: '/src/assets/temp-11.jpg',
    offers: [
      { key: 'Car Pack', value: 'Unlock premium supercars instantly' },
      { key: 'Nitro Boost', value: 'Enhanced performance upgrades' },
      { key: 'VIP Status', value: 'Exclusive tracks and rewards' }
    ],
    currencies: [
      { name: '500 Credits', amount: 2.99 },
      { name: '1200 Credits', amount: 6.99 },
      { name: '2500 Credits', amount: 12.99 },
      { name: '5000 Credits', amount: 24.99 }
    ]
  },
  'adventure-world': {
    title: 'Adventure World',
    publisher: 'Quest Games',
    description: 'Embark on an epic journey through mystical realms filled with ancient secrets, magical creatures, and legendary treasures waiting to be discovered.',
    image: '/src/assets/temp-12.jpg',
    offers: [
      { key: 'Explorer Pack', value: 'Essential gear for your adventures' },
      { key: 'Magic Boost', value: 'Enhanced spells and abilities' },
      { key: 'Treasure Map', value: 'Locate rare artifacts and gold' }
    ],
    currencies: [
      { name: '300 Gems', amount: 1.99 },
      { name: '800 Gems', amount: 4.99 },
      { name: '1800 Gems', amount: 9.99 },
      { name: '4000 Gems', amount: 19.99 }
    ]
  },
  'puzzle-master': {
    title: 'Puzzle Master',
    publisher: 'Brain Games Inc',
    description: 'Challenge your mind with hundreds of brain-teasing puzzles. From logic games to word challenges, test your intelligence and improve your cognitive skills.',
    image: '/src/assets/temp-13.jpg',
    offers: [
      { key: 'Hint Pack', value: 'Get help when puzzles get tough' },
      { key: 'Premium Puzzles', value: 'Access to exclusive challenge modes' },
      { key: 'Ad-Free', value: 'Uninterrupted puzzle solving experience' }
    ],
    currencies: [
      { name: '100 Hints', amount: 0.99 },
      { name: '300 Hints', amount: 2.99 },
      { name: '750 Hints', amount: 6.99 },
      { name: '2000 Hints', amount: 14.99 }
    ]
  },
  'strategy-empire': {
    title: 'Strategy Empire',
    publisher: 'Empire Studios',
    description: 'Build your civilization from the ground up. Manage resources, command armies, and forge alliances in this epic real-time strategy game.',
    image: '/src/assets/temp-14.jpg',
    offers: [
      { key: 'Resource Pack', value: 'Boost your empire\'s growth' },
      { key: 'Military Upgrade', value: 'Strengthen your armies' },
      { key: 'VIP Status', value: 'Exclusive buildings and bonuses' }
    ],
    currencies: [
      { name: '200 Gold', amount: 1.99 },
      { name: '600 Gold', amount: 4.99 },
      { name: '1500 Gold', amount: 9.99 },
      { name: '3500 Gold', amount: 19.99 }
    ]
  },
  'fantasy-rpg': {
    title: 'Fantasy RPG',
    publisher: 'Mythic Games',
    description: 'Enter a world of magic and adventure. Create your hero, master powerful spells, and embark on quests in this immersive role-playing experience.',
    image: '/src/assets/temp-15.jpg',
    offers: [
      { key: 'Character Boost', value: 'Level up faster with XP bonuses' },
      { key: 'Legendary Gear', value: 'Powerful weapons and armor' },
      { key: 'Magic Crystals', value: 'Enhance your spells and abilities' }
    ],
    currencies: [
      { name: '150 Crystals', amount: 1.99 },
      { name: '450 Crystals', amount: 4.99 },
      { name: '1000 Crystals', amount: 9.99 },
      { name: '2500 Crystals', amount: 19.99 }
    ]
  },
  'sports-champions': {
    title: 'Sports Champions',
    publisher: 'Athletic Games',
    description: 'Compete in multiple sports disciplines and become the ultimate champion. From football to basketball, master every sport and claim victory.',
    image: '/src/assets/temp-16.jpg',
    offers: [
      { key: 'Training Pack', value: 'Improve your athlete\'s skills' },
      { key: 'Equipment Upgrade', value: 'Professional sports gear' },
      { key: 'Championship Pass', value: 'Access to premium tournaments' }
    ],
    currencies: [
      { name: '250 Coins', amount: 1.99 },
      { name: '700 Coins', amount: 4.99 },
      { name: '1600 Coins', amount: 9.99 },
      { name: '3800 Coins', amount: 19.99 }
    ]
  },
  'action-hero': {
    title: 'Action Hero',
    publisher: 'Hero Studios',
    description: 'Become the ultimate action hero in this thrilling adventure. Fight enemies, complete missions, and save the world from destruction.',
    image: '/src/assets/temp-17.jpg',
    offers: [
      { key: 'Weapon Cache', value: 'Unlock powerful weapons' },
      { key: 'Hero Upgrade', value: 'Enhanced abilities and skills' },
      { key: 'Mission Pack', value: 'Exclusive story missions' }
    ],
    currencies: [
      { name: '180 Energy', amount: 1.99 },
      { name: '500 Energy', amount: 4.99 },
      { name: '1200 Energy', amount: 9.99 },
      { name: '2800 Energy', amount: 19.99 }
    ]
  },
  'life-simulator': {
    title: 'Life Simulator',
    publisher: 'Reality Games',
    description: 'Live a virtual life from birth to old age. Make choices, build relationships, pursue careers, and create your own unique life story.',
    image: '/src/assets/temp-20.png',
    offers: [
      { key: 'Career Boost', value: 'Fast-track your professional growth' },
      { key: 'Relationship Pack', value: 'Improve social interactions' },
      { key: 'Luxury Items', value: 'Premium lifestyle upgrades' }
    ],
    currencies: [
      { name: '120 Life Points', amount: 0.99 },
      { name: '350 Life Points', amount: 2.99 },
      { name: '800 Life Points', amount: 6.99 },
      { name: '2000 Life Points', amount: 14.99 }
    ]
  },
  'horror-nights': {
    title: 'Horror Nights',
    publisher: 'Nightmare Studios',
    description: 'Experience spine-chilling horror in this terrifying survival game. Escape haunted locations, solve mysteries, and survive the night.',
    image: '/src/assets/temp-21.png',
    offers: [
      { key: 'Survival Kit', value: 'Essential items for survival' },
      { key: 'Flashlight Upgrade', value: 'Better visibility in darkness' },
      { key: 'Ghost Detector', value: 'Detect supernatural presence' }
    ],
    currencies: [
      { name: '90 Tokens', amount: 0.99 },
      { name: '280 Tokens', amount: 2.99 },
      { name: '650 Tokens', amount: 6.99 },
      { name: '1500 Tokens', amount: 14.99 }
    ]
  },
  'survival-island': {
    title: 'Survival Island',
    publisher: 'Wilderness Games',
    description: 'Stranded on a mysterious island, use your wits and skills to survive. Craft tools, build shelter, and uncover the island\'s secrets.',
    image: '/src/assets/temp-22.png',
    offers: [
      { key: 'Crafting Pack', value: 'Advanced crafting materials' },
      { key: 'Shelter Upgrade', value: 'Better protection from elements' },
      { key: 'Explorer Kit', value: 'Tools for island exploration' }
    ],
    currencies: [
      { name: '200 Resources', amount: 1.99 },
      { name: '550 Resources', amount: 4.99 },
      { name: '1300 Resources', amount: 9.99 },
      { name: '3000 Resources', amount: 19.99 }
    ]
  }
};

const StaticGameDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [packages, setPackages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [popup, setPopup] = useState({ show: false, type: '', title: '', message: '' });
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const [addingToCart, setAddingToCart] = useState(false);
  const [showFullOffers, setShowFullOffers] = useState(false);
  const [userId, setUserId] = useState('');

  const toggleOffers = useCallback(() => setShowFullOffers(!showFullOffers), [showFullOffers]);
  
  const handleCurrencySelect = useCallback((currency) => setSelectedCurrency(currency), []);

  const showPopup = useCallback((type, title, message) => {
    setPopup({ show: true, type, title, message });
    setTimeout(() => {
      setPopup({ show: false, type: '', title: '', message: '' });
    }, 4000);
  }, []);

  const closePopup = useCallback(() => setPopup({ show: false, type: '', title: '', message: '' }), []);

  const handlePurchase = useCallback(async () => {
    if (!selectedCurrency) {
      showPopup('error', 'Selection Required', 'Please select a currency package first');
      return;
    }

    if (!userId) {
      showPopup('error', 'User ID Required', 'Please enter your User ID');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showPopup('error', 'Login Required', 'Please login to make a purchase');
      return;
    }

    // Navigate to payment gateway with order details
    navigate('/payment', {
      state: {
        orderDetails: {
          gameName: game.title,
          packageName: selectedCurrency.name,
          amount: selectedCurrency.amount * quantity,
          quantity: quantity,
          gameId: game._id || id,
          currencyName: selectedCurrency.name,
          gameUserId: userId || 'default-user-id'
        }
      }
    });
  }, [selectedCurrency, game, quantity, id, navigate, showPopup, userId]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedCurrency) {
      showPopup('error', 'Selection Required', 'Please select a currency first');
      return;
    }

    if (!userId || userId.trim() === '') {
      showPopup('error', 'User ID Required', 'Please enter your game User ID');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showPopup('error', 'Authentication Required', 'Please login to add items to cart');
      return;
    }

    const fetchPackages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/packages`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPackages(data.data);
          }
        }
      } catch (err) {
        // Fallback to game currencies if packages API fails
        console.log('Using fallback currencies');
      }
    };

    setAddingToCart(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId: game._id || id,
          gameName: game.title,
          gamePageName: game.pageName || game.title,
          gameImage: game.image || '/api/placeholder/400/600',
          currencyName: selectedCurrency.name,
          amount: selectedCurrency.amount,
          quantity: quantity,
          gameUserId: userId.trim()
        })
      });

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an error page instead of JSON. Please check if the server is running.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        showPopup('success', 'Cart Updated', `${quantity} item(s) added to cart successfully!`);
        // Reset form after successful add
        setQuantity(1);
        setSelectedCurrency(null);
        setIsDropdownOpen(false);
        
        // Dispatch cart update event to update header count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        showPopup('error', 'Cart Error', data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Cart add error:', error);
      if (error.message.includes('DOCTYPE')) {
        showPopup('error', 'Server Error', 'Server is not responding correctly. Please try again later.');
      } else if (error.message.includes('Failed to fetch')) {
        showPopup('error', 'Connection Error', 'Unable to connect to server. Please check your internet connection.');
      } else {
        showPopup('error', 'Cart Error', error.message || 'Error adding to cart. Please try again.');
      }
    } finally {
      setAddingToCart(false);
    }
  }, [selectedCurrency, game, quantity, id, showPopup, userId]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
              // Get the game directly from staticGames using the URL parameter
        const foundGame = staticGames[id];
        if (foundGame) {
          setGame({
            ...foundGame,
            // Ensure we have default values for all required fields
            title: foundGame.title || 'Untitled Game',
            publisher: foundGame.publisher || 'Unknown Publisher',
            description: foundGame.description || 'No description available',
            image: foundGame.image || '/src/assets/placeholder-game.jpg',
            offers: foundGame.offers || [],
            currencies: foundGame.currencies || []
          });
          setSelectedCurrency(foundGame.currencies?.[0] || null);
          setError(null);
        } else {
          console.error('Game not found for ID:', id);
          console.log('Available game IDs:', Object.keys(staticGames));
          setError('Game not found');
        }
      } catch (err) {
        console.error('Error loading game:', err);
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-cyan-400 text-lg">
        Loading game details...
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 p-4 text-center">
        <h2 className="text-red-500 text-xl font-bold mb-4">Game Not Found</h2>
        <p className="text-gray-300 mb-6">We couldn't find the game you're looking for.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Back to Home
        </button>
        <div className="mt-8 text-gray-500 text-xs">
          <p>Available games: {Object.keys(staticGames).join(', ')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{game.title} - Game Zone</title>
        <meta name="description" content={game.description.substring(0, 160) + '...'} />
        <meta name="keywords" content={`${game.title}, ${game.publisher}, video games, buy game`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={game.title} />
        <meta property="og:description" content={game.description.substring(0, 160) + '...'} />
        <meta property="og:image" content={game.image} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-600"
          >
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div className="order-2 lg:order-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4"
                >
                  {game.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-cyan-400 text-base sm:text-lg mb-2"
                >
                  by {game.publisher}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 leading-relaxed text-sm sm:text-base"
                >
                  {game.description}
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center order-1 lg:order-2"
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-48 h-64 sm:w-64 sm:h-80 lg:w-80 lg:h-96 object-contain rounded-lg shadow-2xl border-2 border-cyan-400 bg-gray-800"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mt-10"
          >
            <div className="flex flex-col md:flex-row items-start gap-4">
              <img
                src={game.image}
                alt={game.title}
                className="w-full md:w-32 h-48 object-contain rounded-xl shadow-lg border-2 border-cyan-500 transform hover:scale-105 transition-transform duration-300 bg-gray-800"
                loading="lazy"
              />
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                  {game.title}
                </h1>
                <p className="text-lg text-gray-300 font-medium">By {game.publisher}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full shadow-md select-none">
                <FaGlobe className="text-cyan-500 text-base" />
                <span className="text-sm">Global</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full shadow-md select-none">
                <FaBolt className="text-cyan-500 text-base" />
                <span className="text-sm">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full shadow-md select-none">
                <FaShieldAlt className="text-cyan-500 text-base" />
                <span className="text-sm">Official Distribution</span>
              </div>
            </div>

            <p className="text-base leading-relaxed text-gray-200">
              {game.description}
            </p>
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 m-5"
          >
            {/* Offers Section */}
            <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-1">
                <FaShoppingCart className="text-cyan-500 text-base" />
                Offers
              </h2>
              <AnimatePresence>
                {!showFullOffers ? (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-gray-300 mb-2">
                      {game.offers.length > 0 
                        ? `${game.offers[0].key}: ${game.offers[0].value}...`
                        : 'No offers available'}
                    </p>
                  </motion.div>
                ) : (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1"
                  >
                    {game.offers.map((offer, index) => (
                      <li key={index} className="bg-cyan-900 p-1 rounded-lg text-xs">
                        <strong>{offer.key}:</strong> {offer.value}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              {game.offers.length > 0 && (
                <button
                  onClick={toggleOffers}
                  className="mt-2 flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-xs"
                >
                  {showFullOffers ? 'Hide Details' : 'View Details'}
                  {showFullOffers ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
              )}
            </div>

            {/* Select Plan Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <FaDollarSign className="text-cyan-500 text-lg" />
                Select Package
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(packages.length > 0 ? packages : game.currencies).map((curr, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleCurrencySelect(curr)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative p-4 rounded-xl transition-all duration-300 border-2 ${
                      selectedCurrency?.name === curr.name 
                        ? 'bg-gradient-to-br from-cyan-600 to-blue-700 border-cyan-400 shadow-lg shadow-cyan-500/25' 
                        : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:border-cyan-500 hover:shadow-md'
                    }`}
                  >
                    {selectedCurrency?.name === curr.name && (
                      <div className="absolute top-2 right-2">
                        <FaCheckCircle className="text-cyan-300 text-lg" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
                        <img
                          src={game.image}
                          alt={game.title}
                          className="w-8 h-8 object-contain rounded"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold text-white mb-1">{curr.name}</p>
                        <p className="text-lg font-bold text-cyan-400">${(curr.price || curr.amount).toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-2">Purchase</h2>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs mb-1">Enter User ID (Numbers only)</label>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={userId}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers
                      if (/^\d*$/.test(value)) {
                        setUserId(value);
                      }
                    }}
                    placeholder="Your User ID"
                    className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-1">
                    <motion.button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      whileHover={{ scale: 1.05, backgroundColor: "#374151" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-200 shadow-md"
                    >
                      −
                    </motion.button>
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          setQuantity(Math.max(1, Math.min(99, value)));
                        }}
                        className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center text-lg font-semibold border border-gray-600 transition-all duration-200"
                      />
                    </div>
                    <motion.button
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      whileHover={{ scale: 1.05, backgroundColor: "#374151" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-200 shadow-md"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Item:</span>
                  <span className="font-semibold">{game.title} ({selectedCurrency?.name || 'N/A'})</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Quantity:</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Total:</span>
                  <span className="font-semibold text-cyan-400">
                    ${selectedCurrency ? (selectedCurrency.amount * quantity).toFixed(2) : '0.00'}
                  </span>
                </div>
                <motion.button
                  onClick={handlePurchase}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg text-xs"
                >
                  Purchase
                </motion.button>
                <motion.button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-1.5 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 text-white font-semibold rounded-lg flex items-center justify-center gap-1 text-xs"
                >
                  <FaShoppingCart className="text-sm" /> 
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Popup */}
        <AnimatePresence>
          {popup.show && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
            >
              <div className={`rounded-lg p-4 shadow-2xl border-l-4 ${
                popup.type === 'success' 
                  ? 'bg-green-900 border-green-500 text-green-100' 
                  : 'bg-red-900 border-red-500 text-red-100'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {popup.type === 'success' ? (
                        <FaCheckCircle className="text-green-400 text-xl" />
                      ) : (
                        <FaExclamationTriangle className="text-red-400 text-xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{popup.title}</h3>
                      <p className="text-xs opacity-90">{popup.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={closePopup}
                    className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

export default StaticGameDetails;

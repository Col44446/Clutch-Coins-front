const mongoose = require('mongoose');
const Game = require('../models/Game');
require('dotenv').config();

const staticGames = [
  {
    title: 'Warrior Quest',
    publisher: 'Epic Games Studio',
    description: 'Embark on an epic adventure in Warrior Quest, where you play as a legendary warrior fighting through mystical lands filled with dangerous creatures and ancient treasures. Master various combat skills, collect powerful weapons, and uncover the secrets of the ancient world.',
    pageName: 'warrior-quest',
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
  {
    title: 'Elite Shooter',
    publisher: 'Combat Studios',
    description: 'Experience intense tactical combat in Elite Shooter, a premium first-person shooter that combines realistic graphics with strategic gameplay. Choose from multiple game modes, customize your weapons, and compete against players worldwide in ranked matches.',
    pageName: 'elite-shooter',
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
  {
    title: 'Battlegrounds Mobile India',
    publisher: 'Krafton',
    description: 'The ultimate battle royale experience on mobile. Drop into intense 100-player matches, scavenge for weapons and supplies, and fight to be the last one standing. Features multiple maps, vehicles, and constant updates with new content.',
    pageName: 'battlegrounds-mobile',
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
  {
    title: 'Valorant',
    publisher: 'Riot Games',
    description: 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities. Create opportunities to take the shot. Risk everything to save the world. Outsmart, outplay, and outshoot everyone in your way.',
    pageName: 'valorant-tactical',
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
  {
    title: 'Roblox',
    publisher: 'Roblox Corporation',
    description: 'A user-generated platform where you can create, share, and play games with millions worldwide. Explore countless worlds, customize your avatar, and unleash your creativity in this endless gaming universe.',
    pageName: 'roblox-platform',
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
  {
    title: 'Minecraft',
    publisher: 'Mojang Studios',
    description: 'Build, explore, and survive in randomly generated worlds. From simple homes to grand castles, bring your imagination to life one block at a time in this sandbox adventure game.',
    pageName: 'minecraft-sandbox',
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
  {
    title: 'Call of Duty Mobile',
    publisher: 'Activision',
    description: 'Experience the thrill of the world\'s most beloved shooter game, now on your mobile device. Engage in intense multiplayer combat, battle royale matches, and iconic game modes.',
    pageName: 'cod-mobile',
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
  {
    title: 'Speed Racing',
    publisher: 'Velocity Studios',
    description: 'Feel the adrenaline rush in the ultimate racing experience. Customize your dream cars, compete in championships, and dominate the streets in this high-octane racing game.',
    pageName: 'speed-racing',
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
  {
    title: 'Adventure World',
    publisher: 'Quest Games',
    description: 'Embark on an epic journey through mystical realms filled with ancient secrets, magical creatures, and legendary treasures waiting to be discovered.',
    pageName: 'adventure-world',
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
  {
    title: 'Puzzle Master',
    publisher: 'Brain Games Inc',
    description: 'Challenge your mind with hundreds of brain-teasing puzzles. From logic games to word challenges, test your intelligence and improve your cognitive skills.',
    pageName: 'puzzle-master',
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
  {
    title: 'Strategy Empire',
    publisher: 'Empire Studios',
    description: 'Build your civilization from the ground up. Manage resources, command armies, and forge alliances in this epic real-time strategy game.',
    pageName: 'strategy-empire',
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
  {
    title: 'Fantasy RPG',
    publisher: 'Mythic Games',
    description: 'Enter a world of magic and adventure. Create your hero, master powerful spells, and embark on quests in this immersive role-playing experience.',
    pageName: 'fantasy-rpg',
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
  {
    title: 'Sports Champions',
    publisher: 'Athletic Games',
    description: 'Compete in multiple sports disciplines and become the ultimate champion. From football to basketball, master every sport and claim victory.',
    pageName: 'sports-champions',
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
  {
    title: 'Action Hero',
    publisher: 'Hero Studios',
    description: 'Become the ultimate action hero in this thrilling adventure. Fight enemies, complete missions, and save the world from destruction.',
    pageName: 'action-hero',
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
  {
    title: 'Life Simulator',
    publisher: 'Reality Games',
    description: 'Live a virtual life from birth to old age. Make choices, build relationships, pursue careers, and create your own unique life story.',
    pageName: 'life-simulator',
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
  {
    title: 'Horror Nights',
    publisher: 'Nightmare Studios',
    description: 'Experience spine-chilling horror in this terrifying survival game. Escape haunted locations, solve mysteries, and survive the night.',
    pageName: 'horror-nights',
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
  {
    title: 'Survival Island',
    publisher: 'Wilderness Games',
    description: 'Stranded on a mysterious island, use your wits and skills to survive. Craft tools, build shelter, and uncover the island\'s secrets.',
    pageName: 'survival-island',
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
];

async function seedStaticGames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing static games
    await Game.deleteMany({ pageName: { $in: staticGames.map(g => g.pageName) } });
    console.log('Cleared existing static games');

    // Insert new static games
    await Game.insertMany(staticGames);
    console.log('Static games seeded successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding static games:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedStaticGames();
}

module.exports = seedStaticGames;

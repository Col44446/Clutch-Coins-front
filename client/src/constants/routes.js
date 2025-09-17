// Application route constants
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  OTP_VERIFY: '/otp-verify',
  GAMES: '/games',
  GAME_DETAILS: '/games/:id',
  BLOGS: '/blogs',
  
  // Policy pages
  ABOUT: '/about',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  RETURNS: '/returns',
  
  // User routes
  USER_PROFILE: '/account',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin-dashboard',
  ADMIN_ROOT: '/admin',
  ADMIN_GAMES: '/admin/games',
  ADMIN_ADD_GAME: '/admin/games/add',
  ADMIN_BLOG_POST: '/blog-post',
};

// Navigation items for header
export const NAV_ITEMS = {
  PUBLIC: [
    { to: ROUTES.GAMES, label: 'Games' },
    { to: ROUTES.BLOGS, label: 'Blogs' },
    { to: ROUTES.ABOUT, label: 'About us' },
  ],
  MORE: { to: '/more', label: 'More' }
};

export default ROUTES;

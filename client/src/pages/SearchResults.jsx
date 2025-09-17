import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (query) {
      searchGames();
    }
  }, [query, currentPage, filters]);

  const searchGames = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        query,
        page: currentPage.toString(),
        limit: '12'
      });

      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setGames(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (err) {
      setError('Failed to search games');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (game) => {
    navigate(`/games/${game._id}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    navigate(`/search?${params.toString()}`);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">No search query provided</h1>
          <p className="text-gray-400">Please enter a search term to find games.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Search Results for "{query}"
          </h1>
          {pagination.totalGames !== undefined && (
            <p className="text-gray-400">
              Found {pagination.totalGames} game{pagination.totalGames !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-white" />
            <span className="text-white font-medium">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="action">Action</option>
                <option value="adventure">Adventure</option>
                <option value="puzzle">Puzzle</option>
                <option value="strategy">Strategy</option>
                <option value="rpg">RPG</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Min Price ($)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="0"
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Max Price ($)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="100"
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Searching games...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={searchGames}
              className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-500"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {games.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">No games found</h2>
                <p className="text-gray-400">Try adjusting your search terms or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {games.map((game, index) => (
                  <motion.div
                    key={game._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleGameClick(game)}
                    className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="aspect-[9/16] relative overflow-hidden">
                      <img
                        src={game.portraitImage || game.squareImage || game.image || 'https://via.placeholder.com/300x400'}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x400';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-medium text-sm mb-1 truncate">{game.name}</h3>
                      <p className="text-gray-400 text-xs mb-2 truncate">{game.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-400 font-bold text-sm">
                          ${game.price?.toFixed(2) || '0.00'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {game.createdAt && new Date(game.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <span className="text-white px-4">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResults;

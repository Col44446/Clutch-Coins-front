import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogsList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/blogs`
        );
        setBlogs(res.data || []);
      } catch (err) {
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Handle blog card click to toggle expanded view
  const handleBlogClick = (blog) => {
    setSelectedBlog(blog._id === selectedBlog?._id ? null : blog);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white text-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-cyan-400 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-26 bg-gradient-to-br from-gray-900 to-indigo-900 p-4 sm:p-6 lg:p-8">
      {/* Header with vibrant gradient text */}
      <header className="mb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
        >
          Explore <span className="text-white">Blogs</span>
        </motion.h1>
      </header>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-300 text-lg">No blogs found</p>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Initial row-wise grid for blogs */}
          {!selectedBlog ? (
            <motion.div
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.2 }}
            >
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  onClick={() => handleBlogClick(blog)}
                  className="relative bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden cursor-pointer border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-28 sm:h-36 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 line-clamp-3">
                      {blog.content.slice(0, 80)}...
                    </p>
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-medium">
                      Read More
                    </button>
                  </div>
                  {/* Neon glow effect */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </article>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Expanded blog view */}
              <AnimatePresence>
                <motion.aside
                  className="lg:w-3/5 bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-cyan-400/50"
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 200 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {selectedBlog.image && (
                    <img
                      src={selectedBlog.image}
                      alt={selectedBlog.title}
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl mb-6"
                      loading="lazy"
                    />
                  )}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                    {selectedBlog.title}
                  </h2>
                  <p className="text-gray-200 text-base sm:text-lg mb-6 leading-relaxed">
                    {selectedBlog.content}
                  </p>
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Close
                  </button>
                </motion.aside>
              </AnimatePresence>

              {/* Remaining blogs stacked vertically */}
              <div className="lg:w-2/5 flex flex-col gap-4">
                {blogs
                  .filter((blog) => blog._id !== selectedBlog._id)
                  .map((blog) => (
                    <motion.article
                      key={blog._id}
                      onClick={() => handleBlogClick(blog)}
                      className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg overflow-hidden cursor-pointer border border-blue-500/30 hover:border-blue-400 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      {blog.image && (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-20 sm:h-24 object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="p-3">
                        <h2 className="text-sm sm:text-base font-bold text-white mb-1 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                          {blog.content.slice(0, 50)}...
                        </p>
                        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-2 py-1 rounded-lg text-xs">
                          Read More
                        </button>
                      </div>
                    </motion.article>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
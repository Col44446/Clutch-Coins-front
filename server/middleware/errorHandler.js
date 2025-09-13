module.exports = (err, req, res, next) => {
  // Log error in development only
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  // Don't expose internal error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message || 'Something went wrong!';
    
  res.status(err.status || 500).json({
    success: false,
    error: message,
  });
};
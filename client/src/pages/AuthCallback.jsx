import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/', { replace: true });
      return;
    }

    if (token) {
      // Store token and verify user
      localStorage.setItem('token', token);
      
      // Verify token and get user info
      verifyTokenAndLogin(token);
    } else {
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  const verifyTokenAndLogin = async (token) => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.user) {
          // Store user data
          localStorage.setItem('userId', data.user._id);
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('role', data.user.role || 'user');
          
          // Trigger authentication state update
          window.dispatchEvent(new CustomEvent('authStateChanged'));
          
          // Redirect based on role
          const redirectPath = data.user.role === 'admin' ? '/admin-dashboard' : '/account';
          navigate(redirectPath, { replace: true });
        } else {
          throw new Error('Invalid user data');
        }
      } else {
        throw new Error(`Token verification failed: ${response.status}`);
      }
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

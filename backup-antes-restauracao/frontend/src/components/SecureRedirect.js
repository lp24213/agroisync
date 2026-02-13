import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SecureRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // INSTANT redirect - no delays, no animations, just redirect NOW
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const newPath = `${location.pathname}?zx=${timestamp}&no_sw_cr=${randomId}`;

    // Redirect to the secure URL
    navigate(newPath, { replace: true });

    // After redirect, navigate to the actual page
    setTimeout(() => {
      // Determine which page to show based on the path
      let targetPage = '/register'; // default

      if (location.pathname.includes('/signup/product')) {
        targetPage = '/register';
      } else if (location.pathname.includes('/signup/freight')) {
        targetPage = '/register';
      } else if (location.pathname.includes('/signup/store')) {
        targetPage = '/register';
      } else if (location.pathname.includes('/payment')) {
        targetPage = '/register';
      } else if (location.pathname.includes('/two-factor-auth')) {
        targetPage = '/register';
      }

      navigate(targetPage, { replace: true });
    }, 100); // Small delay to ensure secure URL is applied
  }, [navigate, location.pathname]);

  // Return nothing or minimal content since we're redirecting instantly
  return null;
};

export default SecureRedirect;

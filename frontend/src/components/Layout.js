import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StockTicker from './StockTicker';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <StockTicker />
      <Navbar />
      <main className="relative">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
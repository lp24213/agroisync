import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary">
      <Navbar />
      <main className="relative">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

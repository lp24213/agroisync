import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="txc-layout">
      <main className="txc-main">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;

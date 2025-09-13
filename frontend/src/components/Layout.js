import React from 'react';
import { Outlet } from 'react-router-dom';

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

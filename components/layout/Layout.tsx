import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <header className="w-full p-4 bg-primary text-black font-bold text-xl shadow-md">AGROTM</header>
    <main className="flex-1 w-full max-w-6xl mx-auto p-4">{children}</main>
    <footer className="w-full p-4 bg-gray-200 dark:bg-gray-800 text-center text-xs text-gray-500">&copy; {new Date().getFullYear()} AGROTM. Todos os direitos reservados.</footer>
  </div>
);

export default Layout; 
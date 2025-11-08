import React from 'react';
import Navbar from './Navbar';
import '../css/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="user-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
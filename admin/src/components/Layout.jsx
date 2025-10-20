import React from 'react';
import Sidebar from './Sidebar';
import '../css/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
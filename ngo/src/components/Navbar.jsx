// src/components/Navbar.jsx
import React from "react";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md fixed w-full top-0 z-50">
      <h1 className="text-2xl font-bold">NGO Connect</h1>

      <div className="flex items-center gap-6">
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

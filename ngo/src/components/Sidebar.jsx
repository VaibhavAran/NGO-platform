// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/ngo-dashboard" },
    { name: "Profile", path: "/ngo/profile" },
    { name: "Events", path: "/ngo/events" },
  ];

  return (
    <div className="w-64 bg-gray-100 h-screen shadow-md fixed top-16 left-0 p-4">
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-4 py-2 rounded-md font-medium transition ${
                location.pathname === link.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

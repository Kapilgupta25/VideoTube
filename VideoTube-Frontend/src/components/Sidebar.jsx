// src/components/Sidebar.jsx

import React, { useState } from 'react';
import { AiOutlineHome, AiOutlineUser, AiOutlineHistory, AiOutlineLike, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: <AiOutlineHome size={20} />, link: '/home' },
    { name: 'My Channel', icon: <AiOutlineUser size={20} />, link: '/channel' },
    { name: 'History', icon: <AiOutlineHistory size={20} />, link: '/history' },
    { name: 'Liked Videos', icon: <AiOutlineLike size={20} />, link: '/liked' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`h-full w-64 p-4 bg-white dark:bg-gray-900 shadow-xl fixed top-0 left-0 pt-20 transition-all duration-300 transform z-40
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <nav>
          <ul className="space-y-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile after clicking a link
                  className={`flex items-center space-x-4 px-4 py-3 rounded-lg font-medium transition-colors duration-200
                             ${location.pathname === item.link
                               ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shadow-inner'
                               : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

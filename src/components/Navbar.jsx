import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onSearch = () => {}, onCreateClick = () => {} }) {
  return (
    <header className="w-full bg-[#1d2125] border-b border-neutral-800 py-2 px-2 sm:px-3 flex items-center gap-1 sm:gap-2 fixed top-0 left-0 right-0 z-40">
      {/* Left Section - App Switcher & Logo */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button className="w-8 h-8 hover:bg-neutral-700/50 rounded flex items-center justify-center text-neutral-300">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="1" y="3" width="3" height="3" rx="0.5"/>
            <rect x="6.5" y="3" width="3" height="3" rx="0.5"/>
            <rect x="12" y="3" width="3" height="3" rx="0.5"/>
            <rect x="1" y="8.5" width="3" height="3" rx="0.5"/>
            <rect x="6.5" y="8.5" width="3" height="3" rx="0.5"/>
            <rect x="12" y="8.5" width="3" height="3" rx="0.5"/>
          </svg>
        </button>
        
        <Link to="/" className="flex items-center gap-2 px-2 py-1 hover:bg-neutral-700/50 rounded">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <rect x="1" y="1" width="5" height="11" rx="0.5"/>
              <rect x="8" y="1" width="5" height="7" rx="0.5"/>
            </svg>
          </div>
          <span className="font-bold text-white text-base sm:text-lg hidden xs:block">Trello</span>
        </Link>
      </div>

      {/* Middle Section - Search Bar */}
      <div className="flex-1 flex justify-center gap-2 ml-1 sm:ml-2">
        <div className="w-full max-w-xl">
          <div className="relative">
            <svg className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Search"
              className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 rounded bg-[#22272b] border border-neutral-700 text-sm text-white placeholder-neutral-400 focus:outline-none focus:bg-neutral-800 focus:border-neutral-600"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={onCreateClick} 
          className="hidden sm:block bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-white text-sm font-medium"
        >
          Create
        </button>

      </div>

      {/* Right Section - Actions & Icons */}
      <div className="flex items-center gap-1">
        {/* Create Button - Hidden on mobile, visible on tablet+ */}
        

        {/* Mobile Create Button - Only Plus Icon */}
        <button 
          onClick={onCreateClick} 
          className="sm:hidden w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>

        {/* Icon Group */}
        <div className="flex items-center gap-1 ml-1 sm:ml-2">
          {/* Workspace Icon - Hidden on mobile */}
          <button className="hidden md:flex w-8 h-8 hover:bg-neutral-700/50 rounded items-center justify-center text-neutral-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          
          {/* Notification Icon */}
          <button className="w-8 h-8 hover:bg-neutral-700/50 rounded flex items-center justify-center text-neutral-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h16a1 1 0 00.707-1.707L20 11.586V8a6 6 0 00-6-6zm0 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
          </button>
          
          {/* Help Icon - Hidden on mobile */}
          <button className="hidden sm:flex w-8 h-8 hover:bg-neutral-700/50 rounded items-center justify-center text-neutral-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path fill="#1d2125" d="M12 6v8M9 12h6"/>
            </svg>
          </button>
          
          {/* User Avatar */}
          <button className="w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AS
          </button>
        </div>
      </div>
    </header>
  );
}
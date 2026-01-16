// src/components/Navbar.jsx
import React from 'react';

export default function Navbar({ onSearch = () => {}, onCreateClick = () => {} }) {
  return (
    <header className="w-full bg-neutral-800/60 border-b border-neutral-700 backdrop-blur py-3 px-6 flex items-center gap-4 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">T</div>
        <div className="font-semibold">Trello</div>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-3xl">
          <input
            placeholder="Search boards or cards..."
            className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCreateClick}
          className="bg-blue-600 px-3 py-1 rounded text-white font-medium"
          title="Create"
        >
          Create
        </button>

        <div className="flex items-center gap-3 text-neutral-300">
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">🔔</div>
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">?</div>
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">📢</div>
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">AS</div>
        </div>
      </div>
    </header>
  );
}

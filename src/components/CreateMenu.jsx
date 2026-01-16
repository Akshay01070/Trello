// src/components/CreateMenu.jsx
import React, { useEffect, useRef } from 'react';

export default function CreateMenu({ onClose = () => {}, onSelect = () => {} }) {
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // positioned near top-right (adjust as needed)
  return (
    <div className="fixed top-14 right-8 z-50" ref={ref}>
      <div className="bg-neutral-800 border border-neutral-700 rounded shadow-md w-64 p-2">
        <div
          className="p-3 rounded hover:bg-neutral-700 cursor-pointer"
          onClick={() => onSelect('create-board')}
        >
          <div className="font-semibold">Create board</div>
          <div className="text-xs text-neutral-400">A board is made up of cards ordered on lists.</div>
        </div>

        <div className="p-3 rounded opacity-60 cursor-not-allowed">
          <div className="font-semibold">Create workspace view</div>
          <div className="text-xs text-neutral-400">UI only for now</div>
        </div>

        <div className="p-3 rounded opacity-60 cursor-not-allowed">
          <div className="font-semibold">Start with a template</div>
          <div className="text-xs text-neutral-400">UI only for now</div>
        </div>
      </div>
    </div>
  );
}

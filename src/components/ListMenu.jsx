// src/components/ListMenu.jsx
import React, { useEffect, useRef } from 'react';

export default function ListMenu({ onClose, onAddCard, onRename, onDelete }) {
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [onClose]);

  return (
    <div ref={ref} className="bg-white text-black rounded shadow-md p-1 w-44">
      <button
        className="w-full text-left px-3 py-2 hover:bg-gray-100"
        onClick={() => { onAddCard(); onClose(); }}
      >
        Add card
      </button>
      <button
        className="w-full text-left px-3 py-2 hover:bg-gray-100"
        onClick={() => { onRename(); onClose(); }}
      >
        Rename list
      </button>
      <button
        className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
        onClick={() => { if (confirm('Delete this list?')) onDelete(); onClose(); }}
      >
        Remove list
      </button>
    </div>
  );
}

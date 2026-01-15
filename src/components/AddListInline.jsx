import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

export default function AddListInline({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newList = { id: uuid(), title: trimmed, cards: [] };
    onAdd(newList);
    setTitle('');
    setOpen(false);
  }

  return (
    <div className="add-list-inline min-w-[280px] mr-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full h-12 rounded-md bg-white/30 hover:bg-white/40 text-left px-4 flex items-center gap-2"
        >
          <span className="text-lg font-medium">+ Add another list</span>
        </button>
      ) : (
        <div className="bg-white/90 p-3 rounded-md shadow-md">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list name..."
            className="w-full mb-2 p-2 rounded border border-gray-200"
          />
          <div className="flex items-center gap-2">
            <button onClick={submit} className="px-3 py-1 bg-blue-600 text-white rounded">
              Add list
            </button>
            <button onClick={() => { setOpen(false); setTitle(''); }} className="px-2 py-1">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

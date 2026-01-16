// src/components/CreateBoardModal.jsx
import React, { useState } from 'react';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=0b0a2b5a7b576c6c4a2e3f9a4a3d4b6d',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=0b0a2b5a7b576c6c4a2e3f9a4a3d4b6a',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1b30b7f1fdbb1a2a7b4f037b3d5c5f3f',
];

const COLOR_PRESETS = ['#0f172a', '#111827', '#4f46e5', '#06b6d4', '#9333ea', '#ef4444'];

export default function CreateBoardModal({ onClose = () => {}, onCreate = (cfg) => {} }) {
  const [title, setTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [useImage, setUseImage] = useState(true);

  function create() {
    if (!title.trim()) return alert('Please enter a board title');
    const background = useImage ? selectedImage : (selectedColor || '#111827');
    onCreate({ title: title.trim(), background });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-6">
      <div className="bg-neutral-800 text-white w-full max-w-2xl rounded shadow-lg p-6 overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create board</h3>
          <button className="text-neutral-400" onClick={onClose}>✕</button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-neutral-300 mb-2">Background</div>

          <div className="grid grid-cols-3 gap-3">
            {SAMPLE_IMAGES.map((img) => (
              <div key={img} className={`rounded overflow-hidden cursor-pointer border ${selectedImage === img && useImage ? 'ring-2 ring-blue-400' : 'border-transparent'}`} onClick={() => { setSelectedImage(img); setUseImage(true); }}>
                <img src={img} alt="bg" className="w-full h-28 object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-3">
            <div className="text-sm text-neutral-300 mb-2">Or pick a color</div>
            <div className="flex gap-3">
              {COLOR_PRESETS.map(c => (
                <button
                  key={c}
                  onClick={() => { setSelectedColor(c); setUseImage(false); }}
                  className={`w-12 h-8 rounded ${selectedColor === c && !useImage ? 'ring-2 ring-blue-400' : ''}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-neutral-300 mb-2">Board title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded bg-neutral-700 border border-neutral-600" placeholder="e.g. My Project" />
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-3 py-1 bg-neutral-700 rounded">Cancel</button>
          <button onClick={create} className="px-4 py-1 bg-blue-600 rounded">Create</button>
        </div>
      </div>
    </div>
  );
}

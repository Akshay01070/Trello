// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function BoardThumb({ board }) {
  const navigate = useNavigate();
  const thumbnailStyle = { background: "linear-gradient(90deg, #7c3aed80, #06b6d480)" };
  return (
    <div onClick={() => navigate(`/board/${board.id}`)} className="w-64 h-36 rounded-lg overflow-hidden cursor-pointer shadow hover:shadow-lg">
      <div className="h-2" style={{ background: "#111827" }} />
      <div className="h-full flex items-end p-3" style={thumbnailStyle}>
        <div className="bg-black/60 rounded px-2 py-1 text-white text-sm w-full">{board.title}</div>
      </div>
    </div>
  );
}

export default function Home({ data, onCreateBoard }) {
  const boards = data.boards || [];
  return (
    <div className="home-page max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Boards</h1>
      <div className="grid grid-cols-3 gap-6">
        {boards.map(b => <BoardThumb key={b.id} board={b} />)}
        <div className="w-64 h-36 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center cursor-pointer" onClick={() => {
          const title = window.prompt("Create board — enter title");
          if (title !== null) onCreateBoard(title.trim() || "Untitled Board");
        }}>
          <div className="text-neutral-400">Create new board</div>
        </div>
      </div>
    </div>
  );
}

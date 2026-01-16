// src/App.jsx
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { loadData, saveData } from "./utils/storage";
import BoardView from "./components/BoardView";
import CardModal from "./components/CardModal";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CreateMenu from "./components/CreateMenu";
import CreateBoardModal from "./components/CreateBoardModal";

export default function App() {
  let initialData;
  try {
    initialData = loadData();
  } catch (e) {
    console.error('Error loading data:', e);
    initialData = { boards: [], members: [], labels: [] };
  }

  const [data, setData] = useState(initialData);
  const [view, setView] = useState("home");
  const [activeBoardId, setActiveBoardId] = useState(data.boards[0]?.id || null);
  const [activeCard, setActiveCard] = useState(null);

  // create-menu/modal UI
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  function createBoardWithConfig({ title = "Untitled Board", background = null }) {
    const id = uuid();
    const newBoard = {
      id,
      title,
      background, // string: color or image URL
      lists: [{ id: uuid(), title: "To Do", cards: [] }]
    };
    const newData = { ...data, boards: [...(data.boards || []), newBoard] };
    setData(newData);
    setActiveBoardId(id);
    setView("board");
    setShowCreateBoardModal(false);
  }

  function updateBoard(updatedBoard) {
    const newData = { ...data, boards: data.boards.map(b => b.id === updatedBoard.id ? updatedBoard : b) };
    setData(newData);
  }

  function openBoard(boardId) {
    setActiveBoardId(boardId);
    setView("board");
  }

  function openCard(card) {
    setActiveCard(card);
  }

  function saveCard(updatedCard) {
    const newBoards = data.boards.map(b => {
      if (b.id !== activeBoardId) return b;
      return {
        ...b,
        lists: b.lists.map(l => ({
          ...l,
          cards: l.cards.map(c => c.id === updatedCard.id ? updatedCard : c)
        }))
      };
    });
    setData({ ...data, boards: newBoards });
    setActiveCard(null);
  }

  function archiveCard(cardId) {
    const newBoards = data.boards.map(b => {
      if (b.id !== activeBoardId) return b;
      return {
        ...b,
        lists: b.lists.map(l => ({
          ...l,
          cards: l.cards.map(c => c.id === cardId ? { ...c, archived: true } : c)
        }))
      };
    });
    setData({ ...data, boards: newBoards });
    setActiveCard(null);
  }

  function createGlobalLabel(label) {
    if (!label) return;
    const exists = (data.labels || []).some(l => l.id === label.id);
    if (exists) return;
    const newData = { ...data, labels: [...(data.labels || []), label] };
    setData(newData);
  }

  const activeBoard = data.boards.find(b => b.id === activeBoardId) || null;

  return (
    <div className="app-root min-h-screen bg-neutral-900 text-white">
      <Navbar
        onSearch={() => {}}
        onCreateClick={() => setShowCreateMenu(s => !s)}
      />

      {/* Create menu (small popup) */}
      {showCreateMenu && (
        <CreateMenu
          onClose={() => setShowCreateMenu(false)}
          onSelect={(opt) => {
            setShowCreateMenu(false);
            if (opt === "create-board") setShowCreateBoardModal(true);
            // other options are not implemented, keep UI only
          }}
        />
      )}

      <main className="p-6 pt-24">
        {view === "home" && (
          <Home
            data={data}
            onOpenBoard={openBoard}
            onCreateBoard={(title) => createBoardWithConfig({ title })}
          />
        )}

        {view === "board" && activeBoard && (
          // apply board background
          <div
            className="min-h-[70vh] rounded-md p-4"
            style={
              activeBoard.background
                ? activeBoard.background.startsWith("#")
                  ? { backgroundColor: activeBoard.background }
                  : { backgroundImage: `url(${activeBoard.background})`, backgroundSize: "cover", backgroundPosition: "center" }
                : {}
            }
          >
            <button
              onClick={() => setView("home")}
              className="mb-4 px-3 py-1 rounded bg-neutral-800 text-sm"
            >
              ← Back
            </button>

            <BoardView
              board={activeBoard}
              setBoard={(b) => updateBoard(b)}
              members={data.members}
              labels={data.labels || []}
              onOpenCard={(card) => openCard(card)}
            />
          </div>
        )}
      </main>

      {showCreateBoardModal && (
        <CreateBoardModal
          onClose={() => setShowCreateBoardModal(false)}
          onCreate={(cfg) => createBoardWithConfig(cfg)}
        />
      )}

      {activeCard && (
        <CardModal
          card={activeCard}
          members={data.members}
          labels={data.labels || []}
          onCreateLabel={createGlobalLabel}
          onClose={() => setActiveCard(null)}
          onSave={(c) => saveCard(c)}
          onArchive={(id) => archiveCard(id)}
        />
      )}
    </div>
  );
}

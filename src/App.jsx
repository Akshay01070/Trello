// src/App.jsx
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { loadData, saveData } from "./utils/storage";
import BoardView from "./components/BoardView";
import CardModal from "./components/CardModal";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import BoardTopBar from "./components/BoardTopBar";
import FilterPanel from "./components/FilterPanel";
import CreateMenu from "./components/CreateMenu";
import CreateBoardModal from "./components/CreateBoardModal";

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [activeCard, setActiveCard] = useState(null);

  // create menu + create board modal toggles
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);

  // filter UI (kept global here)
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    members: [],
    status: null,
    due: null,
    labels: []
  });

  useEffect(() => saveData(data), [data]);

  const navigate = useNavigate();

  // Create board and navigate to its URL
  function createBoardWithConfig({ title = "Untitled Board", background = null }) {
    const id = uuid();
    const newBoard = {
      id,
      title,
      background,
      lists: [{ id: uuid(), title: "To Do", cards: [] }]
    };
    const newData = { ...data, boards: [...(data.boards || []), newBoard] };
    setData(newData);
    navigate(`/board/${id}`);
    setShowCreateBoardModal(false);
  }

  function updateBoard(updatedBoard) {
    setData({ ...data, boards: data.boards.map(b => b.id === updatedBoard.id ? updatedBoard : b) });
  }

  function createGlobalLabel(label) {
    if (!label) return;
    if ((data.labels || []).some(l => l.id === label.id)) return;
    setData({ ...data, labels: [...(data.labels || []), label] });
  }

  function saveCard(updatedCard, boardId) {
    const newBoards = data.boards.map(b => {
      if (b.id !== boardId) return b;
      return { ...b, lists: b.lists.map(l => ({ ...l, cards: l.cards.map(c => c.id === updatedCard.id ? updatedCard : c) })) };
    });
    setData({ ...data, boards: newBoards });
    setActiveCard(null);
  }

  function archiveCard(cardId, boardId) {
    const newBoards = data.boards.map(b => {
      if (b.id !== boardId) return b;
      return { ...b, lists: b.lists.map(l => ({ ...l, cards: l.cards.map(c => c.id === cardId ? { ...c, archived: true } : c) })) };
    });
    setData({ ...data, boards: newBoards });
    setActiveCard(null);
  }

  // Board page component (reads :boardId)
  function BoardPage() {
    const { boardId } = useParams();
    const board = data.boards.find(b => b.id === boardId);
    if (!board) {
      // if board doesn't exist navigate back to home
      useEffect(() => { navigate("/"); }, []);
      return null;
    }

    // apply background (color or image)
    const backgroundStyle = board.background
      ? (board.background.startsWith("#")
          ? { backgroundColor: board.background }
          : { backgroundImage: `url(${board.background})`, backgroundSize: "cover", backgroundPosition: "center" })
      : {};

    return (
      <div className="w-full">
        <BoardTopBar
          title={board.title}
          onToggleViews={() => {}}
          onOpenFilter={() => setShowFilterPanel(true)}
        />

        <div className="board-background pt-4" style={{ minHeight: "calc(100vh - 160px)", ...backgroundStyle }}>
          <div style={{ height: "calc(100vh - 260px)", paddingBottom: 84 }} className="overflow-x-auto">
            <BoardView
              board={board}
              setBoard={(b) => updateBoard(b)}
              members={data.members}
              labels={data.labels || []}
              onOpenCard={(card) => setActiveCard({ ...card, _boardId: boardId })}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root min-h-screen bg-neutral-900 text-white">
      <Navbar onSearch={() => {}} onCreateClick={() => setShowCreateMenu(s => !s)} />

      {showCreateMenu && (
        <CreateMenu onClose={() => setShowCreateMenu(false)} onSelect={(opt) => {
          setShowCreateMenu(false);
          if (opt === "create-board") setShowCreateBoardModal(true);
        }} />
      )}

      <main className="pt-10">
        <Routes>
          <Route path="/" element={<Home data={data} onCreateBoard={(t) => createBoardWithConfig({ title: t })} />} />
          <Route path="/board/:boardId" element={<BoardPage />} />
          {/* (you can add more routes here later) */}
        </Routes>
      </main>

      {showCreateBoardModal && (
        <CreateBoardModal onClose={() => setShowCreateBoardModal(false)} onCreate={(cfg) => createBoardWithConfig(cfg)} />
      )}

      {showFilterPanel && (
        <FilterPanel labels={data.labels || []} members={data.members || []} filters={filters} onChange={(next) => setFilters({ ...filters, ...next })} onClose={() => setShowFilterPanel(false)} />
      )}

      {activeCard && (
        <CardModal
          card={activeCard}
          members={data.members}
          labels={data.labels || []}
          onCreateLabel={createGlobalLabel}
          onClose={() => setActiveCard(null)}
          onSave={(c) => saveCard(c, activeCard._boardId)}
          onArchive={(id) => archiveCard(id, activeCard._boardId)}
        />
      )}
    </div>
  );
}

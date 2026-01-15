import React, { useEffect, useState } from 'react';
import { loadData, saveData } from './utils/storage';
import BoardView from './components/BoardView';
import CardModal from './components/CardModal';
import SearchFilter from './components/SearchFilter';
import { DragDropContext } from '@hello-pangea/dnd';
import { v4 as uuid } from 'uuid';

// Simple App that supports single-board flow for now
export default function App() {
  const [data, setData] = useState(() => loadData());
  const [board, setBoardState] = useState(data.boards[0]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({ member: null, label: null });
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    // whenever board changes, persist into data and localStorage
    const newData = { ...data, boards: data.boards.map(b => b.id === board.id ? board : b) };
    setData(newData);
    saveData(newData);
    // eslint-disable-next-line
  }, [board]);

  function setBoard(b) {
    setBoardState(b);
  }

  function handleOpenCard(card) {
    setActiveCard(card);
  }

  function handleSaveCard(updated) {
    const newBoard = {
      ...board,
      lists: board.lists.map(l => ({ ...l, cards: l.cards.map(c => c.id === updated.id ? updated : c) }))
    };
    setBoard(newBoard);
    setActiveCard(null);
  }

  function handleArchiveCard(cardId) {
    const newBoard = {
      ...board,
      lists: board.lists.map(l => ({ ...l, cards: l.cards.map(c => c.id === cardId ? { ...c, archived: true } : c) }))
    };
    setBoard(newBoard);
  }

  // search/filter logic (client-side)
  const filteredBoard = {
    ...board,
    lists: board.lists.map(l => ({
      ...l,
      cards: l.cards.filter(c => {
        if (c.archived) return false;
        if (searchText && !c.title.toLowerCase().includes(searchText.toLowerCase())) return false;
        if (filters.member && !c.members?.includes(filters.member)) return false;
        if (filters.label && !c.labels?.includes(filters.label)) return false;
        return true;
      })
    }))
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Trello Clone</h1>
      </header>

      <SearchFilter
        searchText={searchText}
        setSearchText={setSearchText}
        filters={filters}
        setFilters={setFilters}
        members={data.members}
      />

      <BoardView board={filteredBoard} setBoard={setBoard} members={data.members} />

      {/* Card Modal placed here for saving to persistent board */}
      {activeCard && (
        <CardModal
          card={activeCard}
          members={data.members}
          onClose={() => setActiveCard(null)}
          onSave={(updated) => handleSaveCard(updated)}
          onArchive={(id) => { handleArchiveCard(id); setActiveCard(null); }}
        />
      )}
      <footer style={{ padding: 12, opacity: 0.7 }}>Data saved locally (localStorage). Add backend later.</footer>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { loadData, saveData } from "./utils/storage";
import BoardView from "./components/BoardView";
import CardModal from "./components/CardModal";
import SearchFilter from "./components/SearchFilter";
import BoardSelector from "./components/BoardSelector";
import { v4 as uuid } from 'uuid';


export default function App() {
  const [data, setData] = useState(() => loadData());
  const [activeBoardId, setActiveBoardId] = useState(data.boards[0]?.id);
  const [activeCard, setActiveCard] = useState(null); // card object to edit

  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ member: null, label: null });

  const activeBoard = data.boards.find(b => b.id === activeBoardId);

  useEffect(() => {
    saveData(data);
  }, [data]);

function createBoard(boardCandidate) {
  // ensure the board has lists array
  const newBoard = {
    ...boardCandidate,
    id: boardCandidate.id || uuid(),
    title: boardCandidate.title || 'Untitled Board',
    lists: Array.isArray(boardCandidate.lists) && boardCandidate.lists.length
      ? boardCandidate.lists
      : [{ id: uuid(), title: 'To Do', cards: [] }]
  };

  const newData = {
    ...data,
    boards: [...(data.boards || []), newBoard]
  };

  setData(newData);
  setActiveBoardId(newBoard.id);

  // save immediately so localStorage is updated without waiting for useEffect
  try { saveData(newData); } catch (e) { console.error('saveData failed', e); }
  console.log('App: created new board', newBoard);
}

  function updateBoard(updatedBoard) {
    setData({
      ...data,
      boards: data.boards.map(b =>
        b.id === updatedBoard.id ? updatedBoard : b
      )
    });
  }

  function saveCard(updatedCard) {
    updateBoard({
      ...activeBoard,
      lists: activeBoard.lists.map(l => ({
        ...l,
        cards: l.cards.map(c => c.id === updatedCard.id ? updatedCard : c)
      }))
    });
  }

  function archiveCard(cardId) {
    updateBoard({
      ...activeBoard,
      lists: activeBoard.lists.map(l => ({
        ...l,
        cards: l.cards.map(c =>
          c.id === cardId ? { ...c, archived: true } : c
        )
      }))
    });
    setActiveCard(null);
  }

  function createGlobalLabel(newLabel) {
    // avoid duplicates
    const existing = (data.labels || []).find(l => l.id === newLabel.id);
    const newLabels = existing ? data.labels : [...(data.labels || []), newLabel];
    const newData = { ...data, labels: newLabels };
    setData(newData);
    saveData(newData);
  }

  const filteredBoard = activeBoard ? {
    ...activeBoard,
    lists: activeBoard.lists.map(l => ({
      ...l,
      cards: l.cards.filter(c => {
        if (c.archived) return false;
        if (searchText && !c.title.toLowerCase().includes(searchText.toLowerCase())) return false;
        if (filters.member && !c.members?.includes(filters.member)) return false;
        if (filters.label && !c.labels?.includes(filters.label)) return false;
        return true;
      })
    }))
  } : null;

  return (
    <div className="app-layout">
      <BoardSelector
        boards={data.boards}
        activeBoardId={activeBoardId}
        onSelect={setActiveBoardId}
        onCreate={createBoard}
      />

      <div className="main-content">
        <SearchFilter
          searchText={searchText}
          setSearchText={setSearchText}
          filters={filters}
          setFilters={setFilters}
          members={data.members}
        />

        {filteredBoard && (
          <BoardView
            board={filteredBoard}
            setBoard={updateBoard}
            members={data.members}
            labels={data.labels || []}
            onOpenCard={(card) => setActiveCard(card)}
          />
        )}
      </div>

      {activeCard && (
        <CardModal
          card={activeCard}
          members={data.members}
          labels={data.labels || []}
          onCreateLabel={createGlobalLabel}
          onClose={() => setActiveCard(null)}
          onSave={(updatedCard) => {
            saveCard(updatedCard);
            setActiveCard(null);
          }}
          onArchive={archiveCard}
        />
      )}
    </div>
  );
}

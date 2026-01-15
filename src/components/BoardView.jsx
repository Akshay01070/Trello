import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ListColumn from './ListColumn';
import { v4 as uuid } from 'uuid';

export default function BoardView({ board, setBoard, members }) {
  const [activeCard, setActiveCard] = useState(null);

  function handleAddList() {
    const title = prompt('List title');
    if (!title) return;
    const newList = { id: uuid(), title, cards: [] };
    setBoard({ ...board, lists: [...board.lists, newList] });
  }

  function onAddCard(listId, card) {
    const lists = board.lists.map(l => l.id === listId ? { ...l, cards: [...l.cards, card] } : l);
    setBoard({ ...board, lists });
  }

  function onDeleteList(listId) {
    if (!confirm('Delete this list?')) return;
    setBoard({ ...board, lists: board.lists.filter(l => l.id !== listId) });
  }

  function onEditListTitle(listId, title) {
    setBoard({ ...board, lists: board.lists.map(l => l.id === listId ? { ...l, title } : l) });
  }

  function onSaveCard(updated) {
    setBoard({ ...board, lists: board.lists.map(l => ({ ...l, cards: l.cards.map(c => c.id === updated.id ? updated : c) })) });
  }

  function onArchiveCard(cardId) {
    setBoard({ ...board, lists: board.lists.map(l => ({ ...l, cards: l.cards.map(c => c.id === cardId ? { ...c, archived: true } : c) })) });
    setActiveCard(null);
  }

  function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (type === 'list') {
      const newLists = Array.from(board.lists);
      const [moved] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, moved);
      setBoard({ ...board, lists: newLists });
      return;
    }

    // card moved
    const sourceList = board.lists.find(l => l.id === source.droppableId);
    const destList = board.lists.find(l => l.id === destination.droppableId);
    const sourceCards = Array.from(sourceList.cards);
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCards.splice(destination.index, 0, movedCard);
      setBoard({ ...board, lists: board.lists.map(l => l.id === sourceList.id ? { ...l, cards: sourceCards } : l) });
    } else {
      const destCards = Array.from(destList.cards);
      destCards.splice(destination.index, 0, movedCard);
      setBoard({
        ...board,
        lists: board.lists.map(l => {
          if (l.id === sourceList.id) return { ...l, cards: sourceCards };
          if (l.id === destList.id) return { ...l, cards: destCards };
          return l;
        })
      });
    }
  }

  return (
    <div className="board-view">
      <div className="board-header">
        <h2>{board.title}</h2>
        <button onClick={handleAddList}>+ Add list</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="list">
          {(provided) => (
            <div className="lists-row" ref={provided.innerRef} {...provided.droppableProps}>
              {board.lists.map((list, idx) => (
                <ListColumn
                  key={list.id}
                  list={list}
                  index={idx}
                  onAddCard={onAddCard}
                  onDeleteList={onDeleteList}
                  openCard={(c)=>setActiveCard(c)}
                  onEditListTitle={onEditListTitle}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/* Card modal */}
      {activeCard && (
        <div>
          {/* parent will render modal from App to have access to save function */}
        </div>
      )}
    </div>
  );
}

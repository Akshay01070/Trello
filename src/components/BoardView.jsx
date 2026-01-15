// src/components/BoardView.jsx
import React, { useRef, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CardItem from './CardItem';
import AddListInline from './AddListInline';
import ListMenu from './ListMenu';
import { v4 as uuid } from 'uuid';

/**
 * BoardView (updated)
 * - Uses inline ListMenu for three-dots actions (Add card, Rename, Remove)
 * - AddCardInline is controlled via `openAddCardListId`
 * - Rename action focuses the list title input (no prompt)
 */

export default function BoardView({ board, setBoard, members, labels = [],onOpenCard }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openAddCardListId, setOpenAddCardListId] = useState(null);
  // map of refs for list title inputs to focus for rename
  const inputRefs = useRef({});

  // --- list operations (same as before) ---
  function onAddList(newList) {
    setBoard({ ...board, lists: [...board.lists, newList] });
  }

  function onAddCard(listId, card) {
    const lists = board.lists.map(l => (l.id === listId ? { ...l, cards: [...l.cards, card] } : l));
    setBoard({ ...board, lists });
    // if opened via menu, close it
    if (openAddCardListId === listId) setOpenAddCardListId(null);
  }

  function onEditListTitle(listId, title) {
    setBoard({ ...board, lists: board.lists.map(l => (l.id === listId ? { ...l, title } : l)) });
  }

  function onDeleteList(listId) {
    setBoard({ ...board, lists: board.lists.filter(l => l.id !== listId) });
  }

  // --- drag & drop (unchanged) ---
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
      setBoard({
        ...board,
        lists: board.lists.map(l => (l.id === sourceList.id ? { ...l, cards: sourceCards } : l))
      });
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
      <div className="board-header mb-4">
        <h2 className="text-2xl font-bold">{board.title}</h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board-droppable" direction="horizontal" type="list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="lists-row flex gap-4 items-start overflow-x-auto pb-6"
            >
              {board.lists.map((list, idx) => (
                <Draggable draggableId={list.id} index={idx} key={list.id}>
                  {(providedList) => (
                    <div
                      ref={providedList.innerRef}
                      {...providedList.draggableProps}
                      className="bg-neutral-900 text-white rounded-md p-3 min-w-[280px] shadow relative"
                    >
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <input
                          ref={(el) => (inputRefs.current[list.id] = el)}
                          value={list.title}
                          onChange={(e) => onEditListTitle(list.id, e.target.value)}
                          className="bg-transparent border-none text-lg font-semibold w-full focus:outline-none"
                        />

                        <div className="relative" {...providedList.dragHandleProps}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === list.id ? null : list.id);
                            }}
                            className="ml-2 text-sm px-2 py-1 rounded hover:bg-white/10"
                            aria-label="List menu"
                          >
                            ⋯
                          </button>

                          {openMenuId === list.id && (
                            <div className="absolute right-0 mt-2 z-30">
                              <ListMenu
                                onClose={() => setOpenMenuId(null)}
                                onAddCard={() => setOpenAddCardListId(list.id)}
                                onRename={() => {
                                  // focus the list title input for inline rename
                                  setTimeout(() => {
                                    inputRefs.current[list.id]?.focus();
                                    // place cursor at end
                                    const el = inputRefs.current[list.id];
                                    if (el && typeof el.selectionStart === 'number') {
                                      const len = el.value.length;
                                      el.selectionStart = el.selectionEnd = len;
                                    }
                                  }, 50);
                                }}
                                onDelete={() => onDeleteList(list.id)}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <Droppable droppableId={list.id} type="card">
                        {(dropProvided) => (
                          <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="space-y-3 min-h-[40px]">
                            {list.cards.map((card, cIdx) => (
                              <Draggable key={card.id} draggableId={card.id} index={cIdx}>
                                {(cardProvided) => (
                                  <div
                                    ref={cardProvided.innerRef}
                                    {...cardProvided.draggableProps}
                                    {...cardProvided.dragHandleProps}
                                  >
                                    <CardItem card={card} onOpen={() => onOpenCard(card)} labels={labels} />

                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {dropProvided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <div className="mt-3">
                        {/* Add card inline: controlled by openAddCardListId when opened via menu */}
                        <AddCardInline
                          listId={list.id}
                          onAddCard={onAddCard}
                          forcedOpen={openAddCardListId === list.id}
                          onCloseForced={() => setOpenAddCardListId(null)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {/* Trello-style inline add list at the end */}
              <div className="flex items-start">
                <AddListInline onAdd={onAddList} />
              </div>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

/* AddCardInline helper (controlled: forcedOpen prop) */
function AddCardInline({ listId, onAddCard, forcedOpen = false, onCloseForced }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (forcedOpen) setOpen(true);
  }, [forcedOpen]);

  function submit() {
    const t = title.trim();
    if (!t) return;
    onAddCard(listId, { id: uuid(), title: t, description: '', labels: [], members: [], checklist: [], dueDate: null, archived: false });
    setTitle('');
    setOpen(false);
    if (onCloseForced) onCloseForced();
  }

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-white/80 hover:text-white/100"
      >
        + Add a card
      </button>
    );

  return (
    <div>
      <textarea
        rows={2}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title for this card..."
        className="w-full p-2 rounded bg-white/10 text-white mb-2 resize-none"
      />
      <div className="flex gap-2">
        <button onClick={submit} className="px-3 py-1 bg-blue-600 rounded text-white">Add card</button>
        <button onClick={() => { setOpen(false); setTitle(''); if (onCloseForced) onCloseForced(); }} className="px-2 py-1">Cancel</button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import CardItem from './CardItem';
import { v4 as uuid } from 'uuid';

export default function ListColumn({ list, index, onAddCard, onDeleteList, openCard, onEditListTitle }) {
  const [newTitle, setNewTitle] = useState('');
  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div className="list-column" ref={provided.innerRef} {...provided.draggableProps}>
          <div className="list-header" {...provided.dragHandleProps}>
            <input
              value={list.title}
              onChange={(e) => onEditListTitle(list.id, e.target.value)}
              className="list-title-input"
            />
            <button onClick={() => onDeleteList(list.id)}>Delete</button>
          </div>
          <Droppable droppableId={list.id} type="card">
            {(dropProvided) => (
              <div className="card-list" ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                {list.cards.map((card, idx) => (
                  <Draggable draggableId={card.id} index={idx} key={card.id}>
                    {(cardProvided) => (
                      <div
                        ref={cardProvided.innerRef}
                        {...cardProvided.draggableProps}
                        {...cardProvided.dragHandleProps}
                      >
                        <CardItem card={card} onOpen={openCard} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="add-card">
            <input placeholder="Card title" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} />
            <button onClick={() => { if(newTitle.trim()){ onAddCard(list.id, { id: uuid(), title: newTitle.trim(), description:'', labels:[], checklist:[], members:[], dueDate:null, archived:false }); setNewTitle(''); } }}>Add</button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

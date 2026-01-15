import React from 'react';

export default function CardItem({ card, onOpen }) {
  return (
    <div className="card-item" onClick={() => onOpen(card)}>
      <div className="card-title">{card.title}</div>
      <div className="card-meta">
        {card.labels?.map(l => <span key={l} className={`label ${l}`}>{l}</span>)}
      </div>
    </div>
  );
}

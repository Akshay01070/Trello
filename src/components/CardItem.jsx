// src/components/CardItem.jsx
import React from 'react';
import { format } from 'date-fns';

/**
 * Card preview (Tailwind)
 * - Shows multiple label color chips at top (uses label.color)
 * - Shows up to `maxVisible` chips, then "+N"
 * - Accepts `labels` prop: array of label objects {id,name,color}
 * - Card may store labels as array of ids OR array of label objects
 */
export default function CardItem({ card, onOpen, labels = [], maxVisible = 4 }) {
  if (!card) return null;

  // Map card.labels (ids or objects) to full label objects
  const cardLabelObjs = (card.labels || []).map(l => {
    if (!l) return null;
    if (typeof l === 'string') {
      // find label by id in passed labels; fallback to id-only object
      return labels.find(x => x.id === l) || { id: l, name: l, color: 'gray' };
    }
    // assume object already: {id,name,color}
    return l;
  }).filter(Boolean);

  // compute totals for checklist(s)
  const checklists = card.checklists || card.checklist || [];
  let totalItems = 0;
  let doneItems = 0;
  checklists.forEach(cl => {
    const items = cl.items || [];
    totalItems += items.length;
    doneItems += items.filter(i => i.done).length;
  });

  const hasDescription = !!(card.description && card.description.trim().length > 0);
  const hasAttachments = Array.isArray(card.attachments) && card.attachments.length > 0;

  // short due date
  let dueText = null;
  try {
    if (card.dueDate) {
      const d = typeof card.dueDate === 'string' ? new Date(card.dueDate) : card.dueDate;
      if (!isNaN(d)) dueText = format(d, 'MMM d'); // e.g. Jan 17
    }
  } catch (e) {
    dueText = null;
  }

  // map label color name (string) to tailwind bg class
  const colorClass = (c) => {
    if (!c) return 'bg-gray-500';
    const map = {
      green: 'bg-green-500',
      amber: 'bg-amber-500',
      red: 'bg-red-600',
      violet: 'bg-violet-600',
      blue: 'bg-sky-600',
      teal: 'bg-teal-600',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      // allow passing hex (e.g. "#ff0000") — use inline style in that case
    };
    return map[c] || null;
  };

  // Build chip elements (returning either class-based or inline style based on color)
  const chips = cardLabelObjs.map(lbl => {
    // if lbl.color looks like hex (#...), use inline style
    if (typeof lbl.color === 'string' && lbl.color.startsWith('#')) {
      return { key: lbl.id, style: { backgroundColor: lbl.color }, title: lbl.name };
    }
    const cls = colorClass(lbl.color);
    return { key: lbl.id, className: cls, title: lbl.name };
  });

  const visible = chips.slice(0, maxVisible);
  const hiddenCount = Math.max(0, chips.length - maxVisible);

  return (
    <div
      className="card-item p-3 rounded bg-neutral-800 cursor-pointer shadow hover:shadow-md"
      onClick={() => onOpen && onOpen(card)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen && onOpen(card); }}
    >
      {/* label chips row */}
      {chips.length > 0 && (
        <div className="mb-2 flex items-center gap-2">
          {visible.map(ch => (
            <div
              key={ch.key}
              title={ch.title}
              className={`w-10 h-2 rounded-full ${ch.className ? ch.className : ''}`}
              style={ch.style || {}}
            />
          ))}

          {hiddenCount > 0 && (
            <div className="text-xs text-neutral-300 ml-1 px-2 py-0.5 rounded bg-neutral-700/50">
              +{hiddenCount}
            </div>
          )}
        </div>
      )}

      {/* title */}
      <div className="font-semibold text-lg text-white leading-tight">{card.title}</div>

      {/* meta row */}
      <div className="mt-3 flex items-center justify-between text-sm text-neutral-200">
        <div className="flex items-center gap-2">
          {dueText && (
            <div className="bg-amber-400 text-black text-xs px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline-block">
                <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span>{dueText}</span>
            </div>
          )}

          {hasDescription && (
            <div className="text-neutral-300 text-xs flex items-center gap-1 px-2 py-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {totalItems > 0 && (
            <div className="flex items-center gap-1 bg-neutral-700/60 px-2 py-0.5 rounded text-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline-block">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{doneItems}/{totalItems}</span>
            </div>
          )}

          {hasAttachments && (
            <div className="flex items-center gap-1 bg-neutral-700/60 px-2 py-0.5 rounded text-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M21.44 11.05L12.39 2a4.5 4.5 0 00-6.36 6.36L13.63 20.0a3.5 3.5 0 004.95 0 3.5 3.5 0 000-4.95L10.5 7.0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{card.attachments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

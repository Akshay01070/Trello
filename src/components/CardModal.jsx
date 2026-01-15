// src/components/CardModal.jsx
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { formatISO } from 'date-fns';

const DEFAULT_LABELS = [
  { id: 'l1', name: 'frontend', color: 'green' },
  { id: 'l2', name: 'backend', color: 'amber' },
  { id: 'l3', name: 'urgent', color: 'red' },
  { id: 'l4', name: 'design', color: 'violet' },
];

const colorClass = (c) => {
  switch (c) {
    case 'green': return 'bg-green-500';
    case 'amber': return 'bg-amber-600';
    case 'red': return 'bg-red-600';
    case 'violet': return 'bg-violet-600';
    case 'blue': return 'bg-sky-600';
    default: return 'bg-gray-400';
  }
};

export default function CardModal({ card, members = [], onClose, onSave, onArchive, labels: _labels = [] }) {
  const [local, setLocal] = useState(null);
  const [labels, setLabels] = useState([]); // global label options
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('blue');

  useEffect(() => {
    setLabels(_labels && _labels.length ? _labels : DEFAULT_LABELS);
  }, [_labels]);

  useEffect(() => {
    if (card) {
      // ensure shape contains checklists array
      setLocal({
        ...card,
        checklists: Array.isArray(card.checklists) ? card.checklists : []
      });
    } else {
      setLocal(null);
    }
  }, [card]);

  if (!local) return null;

  function toggleLabel(labelId) {
    const exists = local.labels?.includes(labelId);
    const newLabels = exists ? local.labels.filter(l => l !== labelId) : [...(local.labels || []), labelId];
    setLocal({ ...local, labels: newLabels });
  }

  function addNewLabel() {
    const trimmed = newLabelName.trim();
    if (!trimmed) return;
    const nl = { id: uuid(), name: trimmed, color: newLabelColor };
    setLabels([nl, ...labels]);
    // auto-select the new label on the card
    setLocal({ ...local, labels: [...(local.labels || []), nl.id] });
    setNewLabelName('');
  }

  function setDueDate(value) {
    // value is yyyy-mm-dd
    setLocal({ ...local, dueDate: value || null });
  }

  function addChecklist() {
    const newChecklist = { id: uuid(), title: 'Checklist', items: [] };
    setLocal({ ...local, checklists: [...local.checklists, newChecklist] });
  }

  function removeChecklist(checklistId) {
    setLocal({ ...local, checklists: local.checklists.filter(c => c.id !== checklistId) });
  }

  function addChecklistItem(checklistId) {
    setLocal({
      ...local,
      checklists: local.checklists.map(c =>
        c.id === checklistId ? { ...c, items: [...(c.items || []), { id: uuid(), text: 'New item', done: false }] } : c
      )
    });
  }

  function removeChecklistItem(checklistId, itemId) {
    setLocal({
      ...local,
      checklists: local.checklists.map(c => c.id === checklistId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c)
    });
  }

  function toggleChecklistItem(checklistId, itemId) {
    setLocal({
      ...local,
      checklists: local.checklists.map(c => {
        if (c.id !== checklistId) return c;
        return {
          ...c,
          items: c.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i)
        };
      })
    });
  }

  function checklistProgress(checklist) {
    const total = (checklist.items || []).length;
    if (!total) return 0;
    const done = checklist.items.filter(i => i.done).length;
    return Math.round((done / total) * 100);
  }

  function updateTitle(t) {
    setLocal({ ...local, title: t });
  }

  function updateDescription(d) {
    setLocal({ ...local, description: d });
  }

  function toggleMember(memberId) {
    const exists = local.members?.includes(memberId);
    const newMembers = exists ? local.members.filter(m => m !== memberId) : [...(local.members || []), memberId];
    setLocal({ ...local, members: newMembers });
  }

  function save() {
    // ensure labels that are selected are in labels list; parent should persist label options if desired
    onSave && onSave(local);
    onClose && onClose();
  }

  function archive() {
    onArchive && onArchive(local.id);
    onClose && onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-6 overflow-auto" onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose && onClose(); }}>
      <div className="bg-neutral-900 text-white w-[900px] max-w-full rounded shadow-lg p-6">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <input
              value={local.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="bg-transparent text-2xl font-bold w-full border-b border-neutral-700 pb-2 focus:outline-none"
            />
            <div className="mt-3 flex gap-2 items-center">
              <button className="px-3 py-1 border rounded text-sm">+ Add</button>
              <button className="px-3 py-1 border rounded text-sm">Labels</button>
              <button className="px-3 py-1 border rounded text-sm">Dates</button>
              <button className="px-3 py-1 border rounded text-sm">Checklist</button>
              <button className="px-3 py-1 border rounded text-sm">Members</button>
            </div>
          </div>

          <div className="w-64 text-right">
            <div className="mb-2">
              <button onClick={archive} className="px-3 py-1 bg-red-600 rounded text-white mr-2">Archive</button>
              <button onClick={save} className="px-3 py-1 bg-blue-600 rounded text-white">Save</button>
            </div>
            <div className="text-sm text-neutral-400">ID: {local.id}</div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          {/* left column: interactive controls */}
          <div className="col-span-2">
            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <textarea
                value={local.description || ''}
                onChange={(e) => updateDescription(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded bg-neutral-800 border border-neutral-700"
                placeholder="Add a more detailed description..."
              />
            </div>

            {/* Checklists */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Checklists</h4>
                <div>
                  <button onClick={addChecklist} className="px-2 py-1 bg-green-600 rounded text-sm">Add checklist</button>
                </div>
              </div>

              <div className="mt-3 space-y-4">
                {local.checklists.length === 0 && <div className="text-sm text-neutral-400">No checklists yet</div>}
                {local.checklists.map(cl => (
                  <div key={cl.id} className="bg-neutral-800 p-3 rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <input
                          value={cl.title}
                          onChange={(e) => {
                            setLocal({
                              ...local,
                              checklists: local.checklists.map(x => x.id === cl.id ? { ...x, title: e.target.value } : x)
                            });
                          }}
                          className="bg-transparent font-semibold text-lg w-full border-b border-neutral-700 focus:outline-none"
                        />
                        <div className="text-sm text-neutral-400 mt-1">{checklistProgress(cl)}% complete</div>
                        <div className="w-full h-2 bg-neutral-700 rounded mt-2 overflow-hidden">
                          <div style={{ width: `${checklistProgress(cl)}%` }} className="h-full bg-green-500" />
                        </div>
                      </div>

                      <div className="ml-3">
                        <button onClick={() => removeChecklist(cl.id)} className="text-red-400">Delete</button>
                      </div>
                    </div>

                    {/* items */}
                    <div className="mt-3 space-y-2">
                      {(cl.items || []).map(it => (
                        <div key={it.id} className="flex items-center gap-3">
                          <input type="checkbox" checked={!!it.done} onChange={() => toggleChecklistItem(cl.id, it.id)} />
                          <input
                            value={it.text}
                            onChange={(e) => {
                              setLocal({
                                ...local,
                                checklists: local.checklists.map(x => x.id === cl.id ? { ...x, items: x.items.map(i => i.id === it.id ? { ...i, text: e.target.value } : i) } : x)
                              });
                            }}
                            className="bg-transparent flex-1 border-b border-neutral-700 focus:outline-none"
                          />
                          <button onClick={() => removeChecklistItem(cl.id, it.id)} className="text-sm text-red-400">✕</button>
                        </div>
                      ))}

                      <div>
                        <button onClick={() => addChecklistItem(cl.id)} className="text-sm px-2 py-1 bg-blue-600 rounded">Add an item</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* right column: side actions (labels, dates, members) */}
          <div className="col-span-1">
            {/* Labels */}
            <div className="bg-neutral-800 p-3 rounded">
              <h5 className="font-semibold mb-2">Labels</h5>

              <div className="space-y-2 max-h-48 overflow-auto pb-2">
                {labels.map(lbl => (
                  <div key={lbl.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={local.labels?.includes(lbl.id)}
                      onChange={() => toggleLabel(lbl.id)}
                    />
                    <div className={`px-3 py-1 rounded text-white ${colorClass(lbl.color)} text-sm`}>{lbl.name}</div>
                    <div className="text-neutral-400 text-sm ml-auto">✎</div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <input
                  placeholder="New label name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="w-full p-2 mb-2 rounded bg-neutral-700"
                />
                <div className="flex gap-2 items-center">
                  <select value={newLabelColor} onChange={(e) => setNewLabelColor(e.target.value)} className="p-2 rounded bg-neutral-700">
                    <option value="blue">blue</option>
                    <option value="green">green</option>
                    <option value="amber">amber</option>
                    <option value="red">red</option>
                    <option value="violet">violet</option>
                  </select>
                  <button onClick={addNewLabel} className="px-2 py-1 bg-emerald-600 rounded text-white">Create a new label</button>
                </div>
              </div>
            </div>

            {/* Due date */}
            <div className="bg-neutral-800 p-3 rounded mt-4">
              <h5 className="font-semibold mb-2">Dates</h5>
              <div className="text-sm mb-2">Due date</div>
              <input
                type="date"
                value={local.dueDate || ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 rounded bg-neutral-700"
              />
              <div className="text-sm text-neutral-400 mt-2">{local.dueDate ? `Due: ${local.dueDate}` : 'No due date set'}</div>
            </div>

            {/* Members */}
            <div className="bg-neutral-800 p-3 rounded mt-4">
              <h5 className="font-semibold mb-2">Members</h5>
              <div className="space-y-2">
                {members.map(m => (
                  <label key={m.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={local.members?.includes(m.id)} onChange={() => toggleMember(m.id)} />
                    <div>{m.name}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* end body */}
      </div>
    </div>
  );
}

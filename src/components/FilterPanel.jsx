// src/components/FilterPanel.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function FilterPanel({ labels = [], members = [], filters = {}, onChange = () => {}, onClose = () => {} }) {
  const ref = useRef(null);
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // local copies to avoid re-render storms (still call onChange for live filter)
  const [keyword, setKeyword] = useState(filters.keyword || "");
  useEffect(() => { onChange({ keyword }); }, [keyword]);

  function toggleArray(key, value) {
    const arr = filters[key] || [];
    const present = arr.includes(value);
    const next = present ? arr.filter(x => x !== value) : [...arr, value];
    onChange({ [key]: next });
  }

  function setStatus(s) { onChange({ status: s }); }
  function setDue(d) { onChange({ due: d }); }

  return (
    <div className="fixed top-20 right-6 z-50">
      <div ref={ref} className="w-80 bg-neutral-800 p-4 rounded shadow-lg max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Filter</div>
          <button onClick={onClose} className="text-neutral-400">✕</button>
        </div>

        <div className="mb-4">
          <label className="text-sm text-neutral-300">Keyword</label>
          <input value={keyword} onChange={(e)=>setKeyword(e.target.value)} placeholder="Enter a keyword..." className="w-full p-2 rounded bg-neutral-700 mt-1" />
          <div className="text-xs text-neutral-500 mt-1">Search cards, members, labels, and more.</div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-semibold mb-2">Members</div>
          <div className="space-y-2">
            {members.length === 0 && <div className="text-sm text-neutral-400">No members</div>}
            {members.map(m => (
              <label key={m.id} className="flex items-center gap-2">
                <input type="checkbox" checked={(filters.members||[]).includes(m.id)} onChange={() => toggleArray('members', m.id)} />
                <div>{m.name}</div>
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={(filters.members||[]).includes('me')} onChange={() => toggleArray('members', 'me')} />
              <div>Cards assigned to me</div>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-semibold mb-2">Card status</div>
          <label className="flex items-center gap-2"><input type="radio" name="status" checked={filters.status === "complete"} onChange={() => setStatus("complete")} /> Marked as complete</label>
          <label className="flex items-center gap-2"><input type="radio" name="status" checked={filters.status === "incomplete"} onChange={() => setStatus("incomplete")} /> Not marked as complete</label>
          <label className="flex items-center gap-2"><input type="radio" name="status" checked={!filters.status} onChange={() => setStatus(null)} /> All</label>
        </div>

        <div className="mb-4">
          <div className="text-sm font-semibold mb-2">Due date</div>
          <label className="flex items-center gap-2"><input type="radio" name="due" checked={filters.due === "overdue"} onChange={() => setDue("overdue")} /> Overdue</label>
          <label className="flex items-center gap-2"><input type="radio" name="due" checked={filters.due === "nextday"} onChange={() => setDue("nextday")} /> Due in the next day</label>
          <label className="flex items-center gap-2"><input type="radio" name="due" checked={filters.due === "nextweek"} onChange={() => setDue("nextweek")} /> Due in the next week</label>
          <label className="flex items-center gap-2"><input type="radio" name="due" checked={filters.due === "nextmonth"} onChange={() => setDue("nextmonth")} /> Due in the next month</label>
          <label className="flex items-center gap-2"><input type="radio" name="due" checked={!filters.due} onChange={() => setDue(null)} /> All</label>
        </div>

        <div className="mb-4">
          <div className="text-sm font-semibold mb-2">Labels</div>
          <div className="space-y-2">
            <label className="flex items-center gap-2"><input type="checkbox" onChange={() => onChange({ labels: [] })} checked={(filters.labels||[]).length === 0} /> No labels</label>
            {labels.map(lbl => (
              <label key={lbl.id} className="flex items-center gap-2">
                <input type="checkbox" checked={(filters.labels||[]).includes(lbl.id)} onChange={() => toggleArray('labels', lbl.id)} />
                <div className="px-2 py-1 rounded text-white text-sm" style={{ backgroundColor: lbl.color && lbl.color.startsWith('#') ? lbl.color : undefined }} >
                  {lbl.name}
                </div>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

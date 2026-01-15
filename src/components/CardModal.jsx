import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { formatISO } from 'date-fns';

export default function CardModal({ card, members, onClose, onSave, onArchive }) {
  const [local, setLocal] = useState(card ? { ...card } : null);
  if (!card) return null;

  function toggleLabel(label) {
    const labels = local.labels?.includes(label) ? local.labels.filter(l=>l!==label) : [...(local.labels||[]), label];
    setLocal({...local, labels});
  }

  function toggleChecklistItem(id) {
    setLocal({
      ...local,
      checklist: local.checklist.map(i => i.id===id ? {...i, done: !i.done} : i)
    });
  }

  function addChecklist() {
    const item = { id: uuid(), text: 'New item', done: false };
    setLocal({...local, checklist: [...(local.checklist||[]), item]});
  }

  return (
    <div className="modal-backdrop" onClick={(e)=>e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <h3>Card Details</h3>
        <input value={local.title} onChange={(e)=>setLocal({...local, title: e.target.value})} />
        <textarea value={local.description} onChange={(e)=>setLocal({...local, description: e.target.value})} />
        <div>
          <strong>Labels:</strong>
          {['frontend','backend','urgent'].map(l => (
            <button key={l} className={`label ${local.labels?.includes(l) ? 'active' : ''}`} onClick={()=>toggleLabel(l)}>{l}</button>
          ))}
        </div>
        <div>
          <strong>Due:</strong>
          <input type="date" value={local.dueDate ? local.dueDate.split('T')[0] : ''} onChange={(e)=>setLocal({...local, dueDate: e.target.value ? formatISO(new Date(e.target.value)).split('T')[0] : null})} />
        </div>
        <div>
          <strong>Checklist:</strong>
          <button onClick={addChecklist}>Add item</button>
          <ul>
            {local.checklist?.map(it=>(
              <li key={it.id}>
                <input type="checkbox" checked={it.done} onChange={()=>toggleChecklistItem(it.id)} />
                <input value={it.text} onChange={(e)=>setLocal({...local, checklist: local.checklist.map(x=>x.id===it.id?{...x, text:e.target.value}:x)})} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Members:</strong>
          {members.map(m => (
            <label key={m.id}>
              <input type="checkbox" checked={local.members?.includes(m.id)} onChange={()=>{
                const membersList = local.members?.includes(m.id) ? local.members.filter(x=>x!==m.id) : [...(local.members||[]), m.id];
                setLocal({...local, members: membersList});
              }} />
              {m.name}
            </label>
          ))}
        </div>
        <div className="modal-actions">
          <button onClick={()=>onArchive(local.id)}>Archive</button>
          <button onClick={()=>{ onSave(local); onClose();}}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

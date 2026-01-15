import React, { useState } from "react";
import { v4 as uuid } from "uuid";

/**
 * BoardSelector
 * - Uses a <form> with onSubmit to avoid accidental page reloads.
 * - Button is submit type (or you could use type="button").
 * - Calls onCreate with a guaranteed shape for a board.
 * - Emits console.log so you can see the handler firing.
 */
export default function BoardSelector({ boards = [], activeBoardId, onSelect, onCreate }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const newBoard = {
      id: uuid(),
      title: trimmed,
      // ensure at least one list to avoid rendering problems
      lists: [
        { id: uuid(), title: "To Do", cards: [] }
      ]
    };
    console.log("BoardSelector: creating board", newBoard);
    onCreate && onCreate(newBoard);
    setTitle("");
  }

  return (
    <div className="board-selector" role="navigation" aria-label="Boards">
      <h3 style={{ marginTop: 0 }}>Boards</h3>

      <div className="board-list" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {boards.map(board => (
          <div
            key={board.id}
            className={`board-item ${board.id === activeBoardId ? "active" : ""}`}
            onClick={() => onSelect(board.id)}
            style={{ userSelect: 'none' }}
          >
            {board.title}
          </div>
        ))}
      </div>

      {/* form prevents default page reloads and makes Enter work */}
      <form className="create-board" onSubmit={handleSubmit} style={{ marginTop: 12, display: 'flex', gap: 6 }}>
        <input
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="New board title"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
